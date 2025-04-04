import {
  ApiSignupPost201Response,
  ApiSignupPost400Response,
  ApiSignupPostRequest,
} from "@/api/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/utils/send-email";
import { signUpSchema } from "@/lib/zod/auth/auth";
import { handleValidationError } from "@/lib/zod/validation-error";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user, hashes their password, generates an email verification token, and sends a verification email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecureP@ssw0rd
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully. A verification email has been sent.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: clvhgclxy0000zkw9d74mj2mu
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */
export async function POST(
  req: Request
): Promise<NextResponse<ApiSignupPost201Response | ApiSignupPost400Response>> {
  try {
    const body: ApiSignupPostRequest = await req.json();
    const parsedBody = signUpSchema.safeParse(body);

    // Handle validation errors
    if (!parsedBody.success) {
      return handleValidationError(parsedBody.error); // Use reusable validation handler
    }

    const { email, password, name } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

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
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
