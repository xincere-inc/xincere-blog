import {
  AdminDeleteCategoriesRequest,
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
  try {
    const unauthorized = await authorizeAdmin();
    if (unauthorized) return unauthorized;

    const body: AdminDeleteCategoriesRequest = await req.json();

    const validation = await validateIDsSchema.safeParseAsync({
      ids: body.ids,
    });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    // Check if all provided IDs exist and are not already soft-deleted
    const existingTags = await prisma.tag.count({
      where: {
        id: { in: body.ids },
        deletedAt: null,
      },
    });

    if (existingTags !== body.ids.length) {
      return NextResponse.json(
        {
          message: 'Some tag not found or already deleted.',
        },
        { status: 404 }
      );
    }

    // Check if any of the tag have associated articles
    const tagWithArticles = await prisma.tag.findMany({
      where: {
        id: { in: body.ids },
        deletedAt: null,
      },
      include: {
        articles: {
          select: {
            article: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const tagWithNonEmptyArticles = tagWithArticles.filter(
      (tag) => tag.articles.length > 0
    );

    if (tagWithNonEmptyArticles.length > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete tag with associated articles: ${tagWithNonEmptyArticles
            .map((c) => c.name)
            .join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // Perform soft delete by setting deletedAt
    const updated = await prisma.tag.updateMany({
      where: { id: { in: body.ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(
      {
        message: `Deleted ${updated.count} category(s).`,
        count: updated.count,
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

  console.error('Error during category deletion:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during category deletion',
    },
    { status: 500 }
  );
}
