import { ApiChangePasswordPost200Response, ApiChangePasswordPost400Response, ApiChangePasswordPost401Response, ApiChangePasswordPostRequest } from "@/api/client";
import getSession from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/zod/validate";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/change-password:
 *   post:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password by providing the old and new password.
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been changed successfully."
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
 *        $ref: "#/components/responses/ServerError"
 */
export async function POST(req: Request): Promise<NextResponse<
  | ApiChangePasswordPost200Response | ApiChangePasswordPost400Response | ApiChangePasswordPost401Response>> {
  try {
    // Parse and validate request body using Zod
    const body: ApiChangePasswordPostRequest =
      await req.json();

    const parsedBody = changePasswordSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsedBody.error.errors.map((error) => ({
            path: error.path.map(String), // Convert path elements to strings
            message: error.message,
          })),
        },
        { status: 400 })
    }

    const { oldPassword, newPassword } = parsedBody.data;

    // Get user from session
    const session = await getSession();
    const sessionExpired =
      session?.expires && new Date(session.expires).getTime() < Date.now();

    if (!session || sessionExpired) {
      const errorResponse =
      {
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      const errorResponse =
      {
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check if the old password and new password are the same
    if (oldPassword === newPassword) {
      const errorResponse =
      {
        error: "New password cannot be the same as the old password",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const errorResponse =
      {
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

    const responseBody =
    {
      message: "Password has been changed successfully.",
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
    console.error("Error:", error);

    const errorResponse =
    {
      error: "Server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
