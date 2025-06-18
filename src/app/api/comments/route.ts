import {
  Created,
  InternalServerError,
  NotFoundError,
  PostCommentRequest,
  ValidationError,
} from '@/api/client';
import getSession from '@/lib/auth/getSession';
import { prisma } from '@/lib/prisma';
import { createCommentSchema } from '@/lib/zod/comment-management/comment';
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
    return handlePostError(error);
  }
}

function handlePostError(
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
