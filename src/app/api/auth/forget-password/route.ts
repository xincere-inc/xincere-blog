import {
  ForgetPassword404Response,
  ForgetPassword429Response,
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
 * /api/auth/forget-password:
 *   post:
 *     summary: Send a password reset email
 *     description: Sends a reset password email with a secure token link. Each user is allowed a maximum of 3 emails per hour.
 *     operationId: ForgetPassword
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
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset email sent successfully"
 *       400:
 *         description: Validation error or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is required"
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
 *       429:
 *         description: Too many requests within a short period
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Too many requests. Please try again later (1 hr)."
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
    | Success
    | ValidationError
    | ForgetPassword404Response
    | ForgetPassword429Response
    | InternalServerError
  >
> {
  try {
    // Parse the incoming request JSON body
    const data: ForgetPasswordRequest = await req.json();

    // Validate the request body using the emailSchema
    const parsedBody = await emailSchema.safeParseAsync(data);

    // Extract the email from the request data
    const { email } = data;

    // If no email is provided, return a 400 error
    if (!email) {
      const errorResponse = {
        error: 'Email is required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the provided email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const errorResponse = {
        error: 'Email not found.',
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
      const errorResponse = {
        error: 'Too many requests. Please try again later (1 hr).',
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
    const resetPasswordUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${resetPasswordToken}`;

    // Prepare the email options
    const emailOptions = {
      from: process.env.SMTP_USERNAME, // Sender address
      to: email, // Receiver address
      subject: 'Password Reset Request', // Email subject
      html: ` 
        <p>We received a request to reset your password.</p>
        <p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>
      `, // HTML content with the password reset link
    };

    // Send the password reset email to the user
    const emailResponse = await sendEmail(emailOptions);

    if (!emailResponse.success) {
      const errorResponse = {
        error: 'Internal server error',
        message: 'Error sending password reset email',
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Return a success message
    const successResponse = {
      message: 'Password reset email sent successfully',
    };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
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
      console.error('Error during forget password:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during forget password',
        },
        { status: 500 }
      );
    }
  }
}
