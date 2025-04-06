import { ChangePasswordRequest, InternalServerError, Success, UnAuthorizedError, ValidationError } from "@/api/client";
import getSession from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/zod/auth/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password by providing the old and new password.
 *     operationId: changePassword
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Success"
 *       400:
 *         description: Validation error, same old and new password, or invalid old password
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
 *       401:
 *         description: Unauthorized or session expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

export async function POST(req: Request): Promise<NextResponse<
  | Success | ValidationError | UnAuthorizedError | InternalServerError>> {
  try {
    // Parse and validate request body using Zod
    const body: ChangePasswordRequest = await req.json();

    const parsedBody = await changePasswordSchema.parseAsync(body);

    const { oldPassword, newPassword } = parsedBody;

    // Get user from session
    const session = await getSession();
    const sessionExpired =
      session?.expires && new Date(session.expires).getTime() < Date.now();

    if (!session || sessionExpired) {
      const errorResponse = {
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      const errorResponse = {
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check if the old password and new password are the same
    if (oldPassword === newPassword) {
      const errorResponse = {
        error: "New password cannot be the same as the old password",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const errorResponse = {
        error: "Invalid old password",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    const responseBody = {
      message: "Password has been changed successfully.",
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error("Error during change password:", error);
      return NextResponse.json({
        error: "Internal server error",
        message: "Error during change password",
      }, { status: 500 });
    }
  }
}
