import {
  ApiVerifyEmailGet200Response,
  ApiVerifyEmailGet400Response,
} from "@/api/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/verify-email:
 *   get:
 *     summary: Verify user email
 *     description: Verifies the user's email address using a provided verification token. Marks the user's email as verified in the database.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The email verification token sent to the user's email address.
 *         schema:
 *           type: string
 *           example: "d4c79ab8-b6b7-48b4-b5a4-56e8d41be26g"
 *     responses:
 *       200:
 *         description: Email successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email successfully verified"
 *       400:
 *         description: Invalid or expired token, or token not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token is required"
 *                 message:
 *                   type: string
 *                   example: "The provided token is invalid or has expired"
 *       500:
 *        $ref: "#/components/responses/ServerError"
 */
export async function GET(
  req: Request
): Promise<
  NextResponse<ApiVerifyEmailGet200Response | ApiVerifyEmailGet400Response>
> {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    // If token is not provided, return a 400 error
    if (!token) {
      const errorResponse = {
        error: "Token is required",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      const errorResponse = {
        error: "Invalid or expired token",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Mark the user's email as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null, // Remove the verification token after successful verification
      },
    });

    // Return a success message (you can also redirect or send a confirmation email)
    const successResponse = {
      message: "Email successfully verified",
    };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error during email verification:", error);

    // Handle server error
    const errorResponse = {
      error: "Server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
