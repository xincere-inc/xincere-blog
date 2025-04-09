import {
  AdminCreateUserRequest,
  Created,
  InternalServerError,
  UnAuthorizedError,
  ValidationError
} from "@/api/client";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { sendEmail } from "@/lib/utils/send-email";
import { adminCreateUserSchema } from "@/lib/zod/admin/user-management/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";


/**
 * @swagger
 * /api/admin/users/create-user:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user, hashes their password, generates an email verification token, and sends a verification email.
 *     operationId: adminCreateUser
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - country
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               country:
 *                 type: string
 *                 example: "Bangladesh"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecureP@ssw0rd"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Created"
 *       400:
 *         description: Validation errors or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User already exists with this email: user@example.com"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

export async function POST(
  req: Request
): Promise<
  NextResponse<
    | UnAuthorizedError
    | Created
    | ValidationError
    | InternalServerError
  >
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const body: AdminCreateUserRequest = await req.json();
    const parsedBody = await adminCreateUserSchema.parseAsync(body);

    const {
      email,
      password,
      firstName,
      lastName,
      username,
      address,
      phone,
      role,
      country
    } = parsedBody;

    const existingUserEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserEmail) {
      return NextResponse.json(
        { error: `User already exists with this email: ${email}` },
        { status: 400 }
      );
    }

    if (phone) {
      const existingUserPhone = await prisma.user.findUnique({
        where: { phone }
      });

      if (existingUserPhone) {
        return NextResponse.json(
          { error: `User already exists with this phone: ${phone}` },
          { status: 400 }
        );
      }
    }
    if (username) {
      const existingUserUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUserUsername) {
        return NextResponse.json(
          { error: `User already exists with this username: ${username}` },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
        address: address || "",
        country,
        phone: phone || "",
        role
      }
    });

    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken }
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

    const emailResponse = await sendEmail({
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Email Verification",
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `
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
          "User created successfully. A verification email has been sent."
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message
          }))
        },
        { status: 400 }
      );
    } else {
      console.error("Error during create user:", error);
      return NextResponse.json(
        {
          error: "Internal server error",
          message: "Error during create user"
        },
        { status: 500 }
      );
    }
  }
}