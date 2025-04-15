import {
  ForgetPasswordRequest,
  InternalServerError,
  Success,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/utils/send-email';
import { emailSchema } from '@/lib/zod/auth';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

/**
 * @swagger
 * /api/auth/verify-email-request:
 *   post:
 *     summary: Send verification email to a registered user
 *     description: This endpoint sends a verification email to the user with the provided email address.
 *     operationId: sendVerificationEmail
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
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Created"
 *       400:
 *         description: Validation error or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
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
 *                   example: "Email not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

export async function POST(
  req: Request
): Promise<NextResponse<Success | ValidationError | InternalServerError>> {
  try {
    const body: ForgetPasswordRequest = await req.json();

    const parsedBody = await emailSchema.parseAsync(body);

    const { email } = parsedBody;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Email not found.' }, { status: 404 });
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
      subject: 'Email Verification',
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `,
    };

    const emailResponse = await sendEmail(emailOptions);

    if (!emailResponse.success) {
      return NextResponse.json(
        { error: 'Error sending verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error('Error during verify email request:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during verify email request',
        },
        { status: 500 }
      );
    }
  }
}
