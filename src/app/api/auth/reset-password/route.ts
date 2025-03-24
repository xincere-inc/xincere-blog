import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/zod/auth";
import { operations } from "@/types/api";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the incoming request JSON body
    const data: operations["resetPassword"]["requestBody"]["content"]["application/json"] =
      await req.json();

    // Validate the request body using the resetPasswordSchema
    const parsedBody = resetPasswordSchema.safeParse(data);

    // If validation fails, return a 422 error with validation errors
    if (!parsedBody.success) {
      const errorResponse: operations["resetPassword"]["responses"][400]["content"]["application/json"] =
        {
          error: "Validation error",
          details: parsedBody.error.errors,
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Extract token and newPassword from the request data
    const { token, newPassword } = data;

    // If no token or newPassword is provided, return a 400 error
    if (!token || !newPassword) {
      const errorResponse: operations["resetPassword"]["responses"]["400"]["content"]["application/json"] =
        {
          error: "Token and new password are required",
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the provided reset token
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      const errorResponse: operations["resetPassword"]["responses"]["400"]["content"]["application/json"] =
        {
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
    const successResponse: operations["resetPassword"]["responses"]["200"]["content"]["application/json"] =
      {
        message: "Password reset successfully",
      };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error during password reset:", error);

    // Handle server error
    const errorResponse: operations["resetPassword"]["responses"][500]["content"]["application/json"] =
      {
        error: "Server error",
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
