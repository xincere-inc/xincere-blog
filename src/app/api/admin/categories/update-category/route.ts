import {
  AdminUpdateCategoryRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { adminUpdateCategorySchema } from '@/lib/zod/admin/category-management/category';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(
  req: Request
): Promise<
  NextResponse<
    Success | ValidationError | InternalServerError | UnAuthorizedError
  >
> {
  try {
    const authError = await authorizeAdmin();
    if (authError) return authError;

    const body: AdminUpdateCategoryRequest = await req.json();

    const parsed = await validateRequestBody(body);

    if (!parsed.success)
      return parsed.errorResponse as NextResponse<ValidationError>;

    const category = await prisma.category.findUnique({
      where: { id: parsed.data.id, deletedAt: null },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    if (await isSlugConflict(parsed.data.id, parsed.data.slug)) {
      return NextResponse.json(
        { error: 'Slug already taken by another category' },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parsed.data.id },
      data: buildUpdatePayload(parsed.data),
    });

    const responsePayload = {
      message: 'Category updated successfully',
      category: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
        deletedAt: updatedCategory.deletedAt?.toISOString() ?? null,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return handleUnexpectedError(error);
  }
}

async function validateRequestBody(
  body: AdminUpdateCategoryRequest
): Promise<
  | { success: true; data: AdminUpdateCategoryRequest }
  | { success: false; errorResponse: NextResponse<ValidationError> }
> {
  const result = await adminUpdateCategorySchema.safeParseAsync(body);
  if (!result.success) {
    const errorResponse = NextResponse.json(
      {
        error: 'Validation error',
        errors: result.error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      } as ValidationError,
      { status: 400 }
    );
    return { success: false, errorResponse };
  }

  return { success: true, data: result.data };
}

async function isSlugConflict(id: number, slug?: string) {
  if (!slug) return false;

  const existing = await prisma.category.findFirst({
    where: {
      slug,
      NOT: { id },
      deletedAt: null,
    },
  });

  return !!existing;
}

function buildUpdatePayload(data: AdminUpdateCategoryRequest) {
  const { name, slug, description } = data;

  return {
    ...(name && { name }),
    ...(slug && { slug }),
    ...(typeof description !== 'undefined' && { description }),
  };
}

function handleUnexpectedError(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  console.error('Error during update category:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during update category',
    },
    { status: 500 }
  );
}
