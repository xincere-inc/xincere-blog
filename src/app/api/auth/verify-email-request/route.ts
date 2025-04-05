import { ApiAuthVerifyEmailRequestPost200Response } from "@/api/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/utils/send-email";
import { emailSchema } from "@/lib/zod/validate";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * @swagger
 * /api/auth/verify-email-request:
 *   post:
 *     summary: Send verification email to a registered user
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification email sent successfully
 *       400:
 *         description: Validation error or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error
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
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email not found.
 *       500:
 *        $ref: "#/components/responses/ServerError"
 */
export async function POST(
  req: Request
): Promise<
  NextResponse<
    | ApiAuthVerifyEmailRequestPost200Response
    | ApiAuthVerifyEmailRequestPost400Response
  >
> {
  try {
    const data: ApiAuthVerifyEmailRequestPostRequest = await req.json();

    const parsedBody = emailSchema.safeParse(data);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsedBody.error.errors.map((error) => ({
            ...error,
            path: error.path.map(String), // Ensure path is string[]
          })),
        },
        { status: 400 }
      );
    }

    const { email } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${verificationToken}`;

    const emailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Email Verification",
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `,
    };

    const emailResponse = await sendEmail(emailOptions);

    if (!emailResponse.success) {
      return NextResponse.json(
        { error: "Error sending verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during email verification request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
