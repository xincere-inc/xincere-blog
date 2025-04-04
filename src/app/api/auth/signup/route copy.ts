import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/utils/send-email";
import { signUpSchema } from "@/lib/zod/auth";
import { operations } from "@/types/api";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse and validate request body using Zod
    const body: operations["registerUser"]["requestBody"]["content"]["application/json"] =
      await req.json();

    const parsedBody = signUpSchema.safeParse(body);

    // If validation fails, return a 400 error with validation errors
    if (!parsedBody.success) {
      const errorResponse: operations["registerUser"]["responses"][400]["content"]["application/json"] =
        {
          error: "Validation error",
          details: parsedBody.error.errors,
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { email, password, name } = parsedBody.data;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const errorResponse: operations["registerUser"]["responses"][400]["content"]["application/json"] =
        {
          error: "User already exists",
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

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
      const errorResponse: operations["registerUser"]["responses"][500]["content"]["application/json"] =
        {
          error: "Error sending verification email",
        };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Construct response body with correct type
    const responseBody: operations["registerUser"]["responses"][201]["content"]["application/json"] =
      {
        message:
          "User created successfully. A verification email has been sent.",
        user: { id: user.id, email: user.email, name: user.name },
      };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error: unknown) {
    console.error("Error:", error);

    const errorResponse: operations["registerUser"]["responses"][500]["content"]["application/json"] =
      {
        error: "Server error",
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
