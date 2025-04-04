import { prisma } from "@/lib/prisma";
import { authorizeAdmin } from "@/lib/utils/authorize-admin";
import { updateUserSchema } from "@/lib/zod/admin/user-management/user";
import { handleValidationError } from "@/lib/zod/validation-error";
import { NextResponse } from "next/server";

// UserRole is an enum in your Prisma schema
import { UserRole } from "@prisma/client";

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    // Admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    // Parse the request body
    const body = await req.json();
    const parsedBody = updateUserSchema.safeParse(body);

    // Handle validation errors
    if (!parsedBody.success) {
      return handleValidationError(parsedBody.error); // Use reusable validation handler
    }

    // Destructure the validated data
    const { id, email, name, address, phone, role } = parsedBody.data;

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare the updated data with optional fields
    const updatedData: {
      email?: string;
      name?: string;
      address?: string;
      phone?: string;
      role?: UserRole;
    } = {};

    if (email) updatedData.email = email;
    if (name) updatedData.name = name;
    if (address) updatedData.address = address;
    if (phone) updatedData.phone = phone;
    if (role) updatedData.role = role as UserRole;

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    // Return success response with updated user data
    return NextResponse.json(
      {
        message: "User updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          address: updatedUser.address,
          phone: updatedUser.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user update:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
