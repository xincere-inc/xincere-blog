import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { sendEmail } from "@/lib/utils/send-email";
import { adminCreateUserSchema } from "@/lib/zod/admin/user-management/user";
import { handleValidationError } from "@/lib/zod/validation-error";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    const body = await req.json();
    const parsedBody = adminCreateUserSchema.safeParse(body);

    if (!parsedBody.success) {
      return handleValidationError(parsedBody.error); // Use reusable validation handler
    }

    // Destructure the body data
    const { email, password, name, address, phone, role } = parsedBody.data;

    // Check if a user already exists with the incoming email
    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserEmail) {
      return NextResponse.json(
        { error: `User already exists with this email: ${email}` },
        { status: 400 }
      );
    }

    if (phone) {
      // Check if a user already exists with the incoming phone
      const existingUserPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingUserPhone) {
        return NextResponse.json(
          { error: `User already exists with this phone: ${phone}` },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        phone,
        role,
      },
    });

    // Generate email verification token
    const verificationToken = uuidv4();

    // Update the user with the verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

    // Send the verification email
    const emailResponse = await sendEmail({
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Email Verification",
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        { error: "Error sending verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "User created successfully. A verification email has been sent.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during admin user creation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
