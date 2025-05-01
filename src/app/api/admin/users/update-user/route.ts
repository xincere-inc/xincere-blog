import {
  AdminUpdateUserRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { updateAdminUserSchema } from '@/lib/zod/admin/user-management/user';
import { NextResponse } from 'next/server';
// Role is an enum in your Prisma schema
import { Role } from '@prisma/client';
import { z } from 'zod';

export async function PUT(
  req: Request
): Promise<
  NextResponse<
    Success | ValidationError | InternalServerError | UnAuthorizedError
  >
> {
  try {
    // Admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const body: AdminUpdateUserRequest = await req.json();

    // Validate input
    const parsed = await updateAdminUserSchema.safeParseAsync(body);

    const { id, email, firstName, lastName, address, role, country } =
      parsed.data as any;

    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email or phone is already taken by another user (excluding the current user)
    if (email) {
      // Check for conflicts individually and return specific messages
      if (email) {
        const emailTaken = await prisma.user.findFirst({
          where: {
            email,
            NOT: { id },
          },
        });
        if (emailTaken) {
          return NextResponse.json(
            { error: 'Email already taken by another user' },
            { status: 400 }
          );
        }
      }
    }

    // Prepare updated fields
    const updatedData: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      country: string;
      address: string;
      role: Role;
    }> = {};

    if (email) updatedData.email = email;
    if (firstName) updatedData.firstName = firstName;
    if (lastName) updatedData.lastName = lastName;
    if (country) updatedData.country = country;
    if (address) updatedData.address = address;
    if (role) updatedData.role = role as Role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          country: updatedUser.country,
          address: updatedUser.address,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
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
      console.error('Error during update user:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during update user',
        },
        { status: 500 }
      );
    }
  }
}
