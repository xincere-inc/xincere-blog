import {
  AdminCreateArticleRequest,
  Created,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { adminCreateArticleSchema } from '@/lib/zod/admin/article-management/article';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(
  req: Request
): Promise<
  NextResponse<
    UnAuthorizedError | Created | ValidationError | InternalServerError
  >
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const body = await req.json();
    const parsedBody = await adminCreateArticleSchema.parseAsync(body);

    const {
      authorId,
      categoryId,
      title,
      slug,
      summary,
      content,
      markdownContent,
      thumbnailUrl,
      status,
    } = parsedBody;

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: `Article already exists with this slug: ${slug}` },
        { status: 400 }
      );
    }

    await prisma.article.create({
      data: {
        authorId,
        categoryId,
        title,
        slug,
        summary,
        content,
        markdownContent,
        thumbnailUrl,
        status,
      },
    });

    return NextResponse.json(
      { message: 'Article created successfully.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((err) => ({
            path: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error('Error during create article:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during create article',
        },
        { status: 500 }
      );
    }
  }
}
