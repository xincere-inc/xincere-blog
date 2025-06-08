import { AdminUpdateTagRequest, ValidationError } from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { updateTagSchema } from '@/lib/zod/admin/tag-management/tag';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(request: Request) {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) return adminAuthError;

    // Parse and validate request body
    const body = await request.json();

    const parsed = await validateRequestBody(body);

    if (!parsed.success)
      return parsed.errorResponse as NextResponse<ValidationError>;

    const { id, name } = parsed.data;

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Check for name uniqueness if provided
    if (name && name !== existingTag.name) {
      const nameExists = await prisma.tag.findUnique({ where: { name } });
      if (nameExists) {
        return NextResponse.json(
          { error: `Tag already exists with this name: ${name}` },
          { status: 400 }
        );
      }
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Tag updated successfully',
      tag: {
        ...tag,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
        deletedAt: tag.deletedAt ? tag.deletedAt.toISOString() : null,
      },
    });
  } catch (error) {
    handleUnexpectedError(error);
  }
}

async function validateRequestBody(
  body: AdminUpdateTagRequest
): Promise<
  | { success: true; data: AdminUpdateTagRequest }
  | { success: false; errorResponse: NextResponse<ValidationError> }
> {
  const result = await updateTagSchema.safeParseAsync(body);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errorResponse: NextResponse.json(
        {
          error: 'Validation error',
          errors: result.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      ),
    };
  }
}

function handleUnexpectedError(error: any) {
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
