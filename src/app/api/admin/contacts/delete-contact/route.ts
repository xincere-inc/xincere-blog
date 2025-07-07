import {
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { validateIDsSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

interface AdminDeleteContactsRequest {
  ids: number[];
}

type DeleteResponse =
  | UnAuthorizedError
  | Success
  | ValidationError
  | InternalServerError;

export async function DELETE(
  req: Request
): Promise<NextResponse<DeleteResponse>> {
  try {
    const unauthorized = await authorizeAdmin();
    if (unauthorized) return unauthorized;

    const body: AdminDeleteContactsRequest = await req.json();

    const validation = await validateIDsSchema.safeParseAsync({
      ids: body.ids,
    });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    // Check if all provided IDs exist
    const existingContacts = await prisma.contact.count({
      where: {
        id: { in: body.ids },
      },
    });

    if (existingContacts !== body.ids.length) {
      return NextResponse.json(
        {
          message: 'Some contacts not found.',
        },
        { status: 404 }
      );
    }

    // Perform delete
    const deleted = await prisma.contact.deleteMany({
      where: { id: { in: body.ids } },
    });

    return NextResponse.json(
      {
        message: `Deleted ${deleted.count} contact(s).`,
        count: deleted.count,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleUnexpectedError(error);
  }
}

function validationErrorResponse(
  error: z.ZodError
): NextResponse<ValidationError> {
  return NextResponse.json(
    {
      error: 'Validation error',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    },
    { status: 400 }
  );
}

function handleUnexpectedError(
  error: any
): NextResponse<InternalServerError | ValidationError> {
  if (error instanceof z.ZodError) {
    return validationErrorResponse(error);
  }

  console.error('Error during contact deletion:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during contact deletion',
    },
    { status: 500 }
  );
}
