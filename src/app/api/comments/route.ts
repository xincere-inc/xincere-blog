import {
  AdminDeleteCommentsRequest,
  Created,
  GetComments200Response,
  InternalServerError,
  NotFoundError,
  PostCommentRequest,
  ValidationError,
} from '@/api/client';
import getSession from '@/lib/auth/getSession';
import { prisma } from '@/lib/prisma';
import { createCommentSchema } from '@/lib/zod/comment-management/comment';
import { commentQuerySchema } from '@/lib/zod/comment/conmment';
import { validateIDsSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type CreateResponse =
  | Created
  | ValidationError
  | NotFoundError
  | InternalServerError;

export async function POST(
  request: Request
): Promise<NextResponse<CreateResponse>> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validate: PostCommentRequest =
      await createCommentSchema.parseAsync(body);

    const { articleId, name, email, content } = validate;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return NextResponse.json(
        {
          error: 'NotFound',
          message: `Article with ID ${articleId} does not exist.`,
        },
        { status: 404 }
      );
    }

    // Get current user (if authenticated, optional)
    const session = await getSession();
    const userId = session ? session.user.id : null; // userId is null for unauthenticated users

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        articleId,
        userId, // Null if user is not logged in
        name,
        email,
        content,
        status: 'pending', // Default status
      },
      select: {
        id: true,
        articleId: true,
        userId: true,
        name: true,
        email: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Comment posted successfully',
        comment: {
          ...comment,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
          deletedAt: comment.deletedAt ? comment.deletedAt.toISOString() : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  request: Request
): Promise<
  NextResponse<GetComments200Response | ValidationError | InternalServerError>
> {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const parsed = await commentQuerySchema.parseAsync({
      articleId: Number(searchParams.get('articleId')),
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
    });

    const { articleId, page, limit } = parsed;

    const skip = (page - 1) * limit;

    const [commentsRaw, total] = await Promise.all([
      prisma.comment.findMany({
        where: { articleId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where: { articleId } }),
    ]);

    const comments = commentsRaw.map((comment) => ({
      ...comment,
      name: comment.name ?? undefined,
      email: comment.email ?? undefined,
      userId: comment.userId ?? undefined,
      createdAt:
        comment.createdAt instanceof Date
          ? comment.createdAt.toISOString()
          : comment.createdAt,
      updatedAt:
        comment.updatedAt instanceof Date
          ? comment.updatedAt.toISOString()
          : comment.updatedAt,
      deletedAt: comment.deletedAt
        ? comment.deletedAt instanceof Date
          ? comment.deletedAt.toISOString()
          : comment.deletedAt
        : null,
    }));

    return NextResponse.json(
      {
        comments,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    return extractError(error);
  }
}

export async function DELETE(
  request: Request
): Promise<
  NextResponse<
    { message: string } | ValidationError | InternalServerError | NotFoundError
  >
> {
  try {
    const body: AdminDeleteCommentsRequest = await request.json();

    const validation = await validateIDsSchema.safeParseAsync({
      ids: body.ids,
    });

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    // Check that all comments exist and are not already deleted
    const existingComments = await prisma.comment.findMany({
      where: {
        id: { in: body.ids },
        deletedAt: null,
      },
    });

    if (existingComments.length !== body.ids.length) {
      return NextResponse.json(
        {
          error: 'NotFound',
          message: 'One or more comments do not exist or are already deleted',
        },
        { status: 404 }
      );
    }

    // Soft delete: update deletedAt to now
    await prisma.comment.updateMany({
      where: {
        id: { in: body.ids },
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Comment(s) deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'ValidationError',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error during delete comments:', error);
    return NextResponse.json(
      {
        error: 'InternalServerError',
        message: 'Error during delete comments',
      },
      { status: 500 }
    );
  }
}

function handleError(
  error: any
): NextResponse<ValidationError | InternalServerError> {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'ValidationError',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  console.error('Error during create comment:', error);
  return NextResponse.json(
    {
      error: 'InternalServerError',
      message: 'Error during create comment',
    },
    { status: 500 }
  );
}

// Extracts the error object for GET handler
function extractError(
  error: any
): NextResponse<ValidationError | InternalServerError> {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'ValidationError',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  console.error('Error during get comments:', error);

  return NextResponse.json(
    {
      error: 'InternalServerError',
      message: 'Error during get comments',
    },
    { status: 500 }
  );
}

function validationErrorResponse(
  error: z.ZodError
): NextResponse<ValidationError> {
  return NextResponse.json(
    {
      error: 'ValidationError',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    },
    { status: 400 }
  );
}
