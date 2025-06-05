import {
  AdminCreateCategoryRequest,
  Created,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { adminCreateCategorySchema } from '@/lib/zod/admin/category-management/category';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type CreateResponse =
  | UnAuthorizedError
  | Created
  | ValidationError
  | InternalServerError;

export async function POST(
  req: Request
): Promise<NextResponse<CreateResponse>> {
  try {
    const unauthorized = await authorizeAdmin();
    if (unauthorized) return unauthorized;

    const body: AdminCreateCategoryRequest = await req.json();
    const validated = await adminCreateCategorySchema.parseAsync(body);

    const { name, slug, description } = validated;

    const duplicate = await prisma.category.findUnique({ where: { slug } });

    if (duplicate) {
      return NextResponse.json(
        { error: `Category already exists with this slug: ${slug}` },
        { status: 400 }
      );
    }

    const createdCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return NextResponse.json(
      {
        message: 'Category created successfully.',
        category: {
          id: createdCategory.id,
          name: createdCategory.name,
          slug: createdCategory.slug,
          description: createdCategory.description,
          createdAt: createdCategory.createdAt.toISOString(),
          updatedAt: createdCategory.updatedAt.toISOString(),
          deletedAt: createdCategory.deletedAt?.toISOString() || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handlePostError(error);
  }
}

function handlePostError(
  error: unknown
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
