import {
  ChangePasswordRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import getSession from '@/lib/auth/getSession';
import { prisma } from '@/lib/prisma';
import { changePasswordSchema } from '@/lib/zod/auth/auth';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(
  req: Request
): Promise<
  NextResponse<
    Success | ValidationError | UnAuthorizedError | InternalServerError
  >
> {
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
        error: 'Unauthorized',
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      const errorResponse = {
        error: 'Unauthorized',
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Check if the old password and new password are the same
    if (oldPassword === newPassword) {
      const errorResponse = {
        error: 'New password cannot be the same as the old password',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      const errorResponse = {
        error: 'Invalid old password',
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
      message: 'Password has been changed successfully.',
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: unknown) {
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
      console.error('Error during change password:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during change password',
        },
        { status: 500 }
      );
    }
  }
}
