import {
  AdminDeleteArticlesRequest,
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

type DeleteResponse =
  | UnAuthorizedError
  | Success
  | ValidationError
  | InternalServerError;

export async function DELETE(
  req: Request
): Promise<NextResponse<DeleteResponse>> {
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body: AdminDeleteArticlesRequest = await req.json();
    const validation = await validateIDsSchema.safeParseAsync({
      ids: body.ids,
    });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const deleted = await prisma.article.deleteMany({
      where: { id: { in: body.ids } },
    });

    return NextResponse.json(
      {
        message: `Deleted ${deleted.count} article(s).`,
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
  error: unknown
): NextResponse<InternalServerError | ValidationError> {
  if (error instanceof z.ZodError) {
    return validationErrorResponse(error);
  }

  console.error('Error during article deletion:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during article deletion',
    },
    { status: 500 }
  );
}
