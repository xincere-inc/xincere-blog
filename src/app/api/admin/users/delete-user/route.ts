import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { validateUUIDSSchema } from "@/lib/zod/common";
import { handleValidationError } from "@/lib/zod/validation-error";
import { NextResponse } from "next/server";

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    // Parse the request body
    const { ids } = await req.json();

    // Validate the request body using the Zod schema
    const parsedBody = validateUUIDSSchema.safeParse({ ids });

    if (!parsedBody.success) {
      return handleValidationError(parsedBody.error);
    }

    // Fetch users to delete by ids
    const usersToDelete = await prisma.user.findMany({
      where: {
        id: { in: ids },
      },
    });

    if (usersToDelete.length !== ids.length) {
      return NextResponse.json(
        { error: "Some users not found with the provided ids" },
        { status: 404 }
      );
    }

    // Delete users
    await prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json(
      { message: `${ids.length} user(s) deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user deletion:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
