import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/utils/send-email";
import { emailSchema } from "@/lib/zod/auth";
import { operations } from "@/types/api";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the incoming request JSON body
    const data: operations["verifyEmailRequest"]["requestBody"]["content"]["application/json"] =
      await req.json();

    // Validate the request body using the emailSchema
    const parsedBody = emailSchema.safeParse(data);

    // If validation fails, return a 400 error with validation errors
    if (!parsedBody.success) {
      const errorResponse: operations["verifyEmailRequest"]["responses"][400]["content"]["application/json"] =
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
      const errorResponse: operations["verifyEmailRequest"]["responses"][400]["content"]["application/json"] =
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
      const errorResponse: operations["verifyEmailRequest"]["responses"][404]["content"]["application/json"] =
        {
          error: "Email not found. ",
        };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Generate a verification token (UUID) and save it to the user record
    const verificationToken = uuidv4();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
      },
    });

    // Construct the verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

    // Prepare the email options
    const emailOptions = {
      from: process.env.SMTP_USERNAME, // Sender address
      to: email, // Receiver address
      subject: "Email Verification", // Email subject
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `, // HTML content with the verification link
    };

    // Send verification email to the user
    const emailResponse = await sendEmail(emailOptions);

    if (!emailResponse.success) {
      const errorResponse: operations["verifyEmailRequest"]["responses"][500]["content"]["application/json"] =
        {
          error: "Error sending verification email",
        };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return a success message
    const successResponse: operations["verifyEmailRequest"]["responses"][200]["content"]["application/json"] =
      {
        message: "Verification email sent successfully",
      };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error during email verification request:", error);

    // Handle server error
    const errorResponse: operations["verifyEmailRequest"]["responses"][500]["content"]["application/json"] =
      {
        error: "Server error",
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
