import {
  ApiResetPasswordPost200Response,
  ApiResetPasswordPost400Response,
  ApiResetPasswordPostRequest,
} from "@/api/client";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/zod/auth/auth";
import { handleValidationError } from "@/lib/zod/validation-error";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset password for a user
 *     description: Resets the user's password using a provided reset token and new password. The reset token is invalidated after the reset.
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
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
 *        $ref: "#/components/responses/ServerError"
 */
export async function POST(
  req: Request
): Promise<
  NextResponse<
    ApiResetPasswordPost200Response | ApiResetPasswordPost400Response
  >
> {
  try {
    // Parse the incoming request JSON body
    const data: ApiResetPasswordPostRequest = await req.json();

    // Validate the request body using the resetPasswordSchema
    const parsedBody = resetPasswordSchema.safeParse(data);

    // Handle validation errors
    if (!parsedBody.success) {
      return handleValidationError(parsedBody.error); // Use reusable validation handler
    } // If validation fails, return a 400 error with validation errors

    // Extract token and newPassword from the request data
    const { token, newPassword } = data;

    // If no token or newPassword is provided, return a 400 error
    if (!token || !newPassword) {
      const errorResponse = {
        error: "Token and new password are required",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the provided reset token
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      const errorResponse = {
        error: "Invalid or expired token",
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
      message: "Password reset successfully",
    };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error during password reset:", error);

    // Handle server error
    const errorResponse = {
      error: "Server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
