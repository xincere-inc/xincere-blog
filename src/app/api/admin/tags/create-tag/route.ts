import {
  AdminCreateTagRequest,
  Created,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { createTagSchema } from '@/lib/zod/admin/tag-management/tag';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type CreateResponse =
  | UnAuthorizedError
  | Created
  | ValidationError
  | InternalServerError;

export async function POST(
  request: Request
): Promise<NextResponse<CreateResponse>> {
  try {
    // Authenticate admin
    const unauthorized = await authorizeAdmin();
    if (unauthorized) return unauthorized;

    // Parse and validate request body
    const body = await request.json();
    const validate: AdminCreateTagRequest =
      await createTagSchema.parseAsync(body);

    const { name } = validate;

    // Check for existing tag
    const existingTag = await prisma.tag.findUnique({ where: { name } });

    if (existingTag) {
      return NextResponse.json(
        { error: `Tag already exists with this name: ${name}` },
        { status: 400 }
      );
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: { name },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Tag created successfully.',

        tag: {
          ...tag,
          createdAt: tag.createdAt.toISOString(),
          updatedAt: tag.updatedAt.toISOString(),
          deletedAt: tag.deletedAt ? tag.deletedAt.toISOString() : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handlePostError(error);
  }
}

function handlePostError(
  error: any
): NextResponse<ValidationError | InternalServerError> {
  if (error instanceof z.ZodError) {
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

  console.error('Error during create category:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during create category',
    },
    { status: 500 }
  );
}
