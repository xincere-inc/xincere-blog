import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/utils/send-email";
import { emailSchema } from "@/lib/zod/auth";
import { operations } from "@/types/api";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the incoming request JSON body
    const data: operations["sendPasswordResetEmail"]["requestBody"]["content"]["application/json"] =
      await req.json();

    // Validate the request body using the emailSchema
    const parsedBody = emailSchema.safeParse(data);

    // If validation fails, return a 400 error with validation errors
    if (!parsedBody.success) {
      const errorResponse: operations["sendPasswordResetEmail"]["responses"][400]["content"]["application/json"] =
        {
          error: "Validation error",
          details: parsedBody.error.errors,
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Extract the email from the request data
    const { email } = data;

    // If no email is provided, return a 400 error
    if (!email) {
      const errorResponse: operations["sendPasswordResetEmail"]["responses"][400]["content"]["application/json"] =
        {
          error: "Email is required",
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the provided email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const errorResponse: operations["sendPasswordResetEmail"]["responses"][404]["content"]["application/json"] =
        {
          error: "Email not found.",
        };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if the user has already reached the max limit for reset password emails
    const currentTime = new Date();
    const lastMailTime = new Date(user.resetPasswordMailTime || 0);
    const timeDifference = currentTime.getTime() - lastMailTime.getTime();
    const oneHourInMilliseconds = 60 * 60 * 1000;

    let newMailCount = user.resetPasswordMailCount;

    if (timeDifference >= oneHourInMilliseconds) {
      newMailCount = 1; // Reset count after one hour
    } else if (
      user.resetPasswordMailCount >= 3 &&
      timeDifference < oneHourInMilliseconds
    ) {
      const errorResponse: operations["sendPasswordResetEmail"]["responses"][429]["content"]["application/json"] =
        {
          error: "Too many requests. Please try again later (1 hr).",
        };
      return NextResponse.json(errorResponse, { status: 429 });
    } else {
      newMailCount += 1;
    }

    // Generate a password reset token (UUID)
    const resetPasswordToken = uuidv4();

    // Update the user's reset password token and mail count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordMailCount: newMailCount,
        resetPasswordMailTime: currentTime,
      },
    });

    // Construct the password reset URL
    const resetPasswordUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}`;

    // Prepare the email options
    const emailOptions = {
      from: process.env.SMTP_USERNAME, // Sender address
      to: email, // Receiver address
      subject: "Password Reset Request", // Email subject
      html: ` 
        <p>We received a request to reset your password.</p>
        <p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>
      `, // HTML content with the password reset link
    };

    // Send the password reset email to the user
    const emailResponse = await sendEmail(emailOptions);

    if (!emailResponse.success) {
      const errorResponse: operations["sendPasswordResetEmail"]["responses"][500]["content"]["application/json"] =
        {
          error: "Error sending password reset email.",
        };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return a success message
    const successResponse: operations["sendPasswordResetEmail"]["responses"][200]["content"]["application/json"] =
      {
        message: "Password reset email sent successfully",
      };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error during forgot password request:", error);

    // Handle server error
    const errorResponse: operations["sendPasswordResetEmail"]["responses"][500]["content"]["application/json"] =
      {
        error: "Server error",
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
