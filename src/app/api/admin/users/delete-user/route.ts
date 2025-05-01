import {
  AdminDeleteUsersRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import getSession from '@/lib/auth/getSession';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { validateUUIDSSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function DELETE(
  req: Request
): Promise<
  NextResponse<
    UnAuthorizedError | Success | ValidationError | InternalServerError
  >
> {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const session = await getSession();
    const loggedUserId = session?.user?.id;

    const body: AdminDeleteUsersRequest = await req.json();
    const { ids } = body;

    const parsedBody = await validateUUIDSSchema.safeParseAsync({ ids });
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: parsedBody.error.errors.map((error) => ({
            path: error.path.join('.'),
            message: error.message,
          })),
        },
        { status: 400 }
      );
    }

    // Fetch roles of users being deleted
    const usersToDelete = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        role: true,
      },
    });

    // Filter out other admins (excluding self)
    const filteredIds = usersToDelete
      .filter(
        (user) => user.role !== 'admin' || user.id === loggedUserId // Allow self, block other admins
      )
      .map((user) => user.id);

    if (filteredIds.length === 0) {
      return NextResponse.json(
        {
          message:
            'No users were deleted. Admins cannot delete other admin accounts.',
          count: 0,
        },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.user.deleteMany({
      where: {
        id: {
          in: filteredIds,
        },
      },
    });

    return NextResponse.json(
      {
        message: `Deleted ${deleteResult.count} user(s). Admins can only delete non-admins or their own account.`,
        count: deleteResult.count,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((error) => ({
            path: error.path.join('.'),
            message: error.message,
          })),
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during user deletion',
        },
        { status: 500 }
      );
    }
  }
}
