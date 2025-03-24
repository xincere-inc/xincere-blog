import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/zod/auth";
import { operations } from "@/types/api";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse and validate request body using Zod
    const body: operations["changePassword"]["requestBody"]["content"]["application/json"] =
      await req.json();

    const parsedBody = changePasswordSchema.safeParse(body);

    if (!parsedBody.success) {
      const errorResponse: operations["changePassword"]["responses"][400]["content"]["application/json"] =
        {
          error: "Validation error",
          details: parsedBody.error.errors,
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { oldPassword, newPassword } = parsedBody.data;

    // Get user from session
    const session = await getSession();
    const sessionExpired =
      session?.expires && new Date(session.expires).getTime() < Date.now();

    if (!session || sessionExpired) {
      const errorResponse: operations["changePassword"]["responses"][401]["content"]["application/json"] =
        {
          error: "Unauthorized",
        };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      const errorResponse: operations["changePassword"]["responses"][401]["content"]["application/json"] =
        {
          error: "Unauthorized",
        };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check if the old password and new password are the same
    if (oldPassword === newPassword) {
      const errorResponse: operations["changePassword"]["responses"][400]["content"]["application/json"] =
        {
          error: "New password cannot be the same as the old password",
        };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const errorResponse: operations["changePassword"]["responses"][400]["content"]["application/json"] =
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

    const responseBody: operations["changePassword"]["responses"][200]["content"]["application/json"] =
      {
        message: "Password has been changed successfully.",
      };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
    console.error("Error:", error);

    const errorResponse: operations["changePassword"]["responses"][500]["content"]["application/json"] =
      {
        error: "Server error",
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
