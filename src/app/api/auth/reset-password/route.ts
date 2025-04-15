import {
  InternalServerError,
  ResetPasswordRequest,
  Success,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/zod/auth';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset password for a user
 *     description: Resets the user's password using a provided reset token and new password. The reset token is invalidated after the reset.
 *     operationId: resetPassword
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "d4c79ab8-b6b7-48b4-b5a4-56e8d41be26f"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecureP@ssw0rd"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Created"
 *       400:
 *         description: Invalid or expired token, or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token and new password are required"
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
    // Parse the incoming request JSON body
    const data: ResetPasswordRequest = await req.json();

    // Validate the request body using the resetPasswordSchema
    const parsedBody = await resetPasswordSchema.parseAsync(data);

    // Extract token and newPassword from the request data
    const { token, newPassword } = parsedBody;

    // If no token or newPassword is provided, return a 400 error
    if (!token || !newPassword) {
      const errorResponse = {
        error: 'Token and new password are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the provided reset token
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      const errorResponse = {
        error: 'Invalid or expired token',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password and remove the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null, // Invalidate the token after use
        resetPasswordMailCount: 0,
        resetPasswordMailTime: null,
      },
    });

    // Return a success message
    const successResponse = {
      message: 'Password reset successfully',
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
      console.error('Error during reset password:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during reset password',
        },
        { status: 500 }
      );
    }
  }
}
