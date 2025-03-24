import { prisma } from "@/lib/prisma";
import { operations } from "@/types/api";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    console.log(token);

    // If token is not provided, return a 400 error
    if (!token) {
      const errorResponse: operations["verifyEmail"]["responses"][400]["content"]["application/json"] =
        {
          error: "Token is required",
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    console.log(user);

    if (!user) {
      const errorResponse: operations["verifyEmail"]["responses"][400]["content"]["application/json"] =
        {
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
    const successResponse: operations["verifyEmail"]["responses"][200]["content"]["application/json"] =
      {
        message: "Email successfully verified",
      };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error during email verification:", error);

    // Handle server error
    const errorResponse: operations["verifyEmail"]["responses"][500]["content"]["application/json"] =
      {
        error: "Server error",
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
