import {
  AdminUpdateArticleRequest,
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { adminUpdateArticleSchema } from '@/lib/zod/admin/article-management/article';
import { ArticleStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(
  req: Request
): Promise<NextResponse<Success | ValidationError | InternalServerError | UnAuthorizedError>> {
  try {
    const authError = await authorizeAdmin();
    if (authError) return authError;

    const body: AdminUpdateArticleRequest = await req.json();
    const { success, data, errorResponse } = await validateRequestBody(body);
    if (!success) return errorResponse;

    const article = await prisma.article.findUnique({ where: { id: parsed.data.id } });
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (await isSlugConflict(parsed.data.id, parsed.data.slug)) {
      return NextResponse.json(
        { error: 'Slug already taken by another article' },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: parsed.data.id },
      data: buildUpdatePayload(parsed.data),
    });

    const responsePayload = {
      message: 'Article updated successfully',
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        status: updatedArticle.status,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return handleUnexpectedError(error);
  }
}

async function validateRequestBody(body: AdminUpdateArticleRequest) {
  const result = await adminUpdateArticleSchema.safeParseAsync(body);
  if (!result.success) {
    const errorResponse = NextResponse.json(
      {
        error: 'Validation error',
        errors: result.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
    return { success: false, errorResponse };
  }

  return { success: true, data: result.data };
}

async function isSlugConflict(id: number, slug?: string) {
  if (!slug) return false;

  const existing = await prisma.article.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  return !!existing;
}

function buildUpdatePayload(data: AdminUpdateArticleRequest) {
  const {
    title,
    slug,
    summary,
    content,
    markdownContent,
    thumbnailUrl,
    status,
    categoryId,
    authorId,
  } = data;

  return {
    ...(title && { title }),
    ...(slug && { slug }),
    ...(summary && { summary }),
    ...(content && { content }),
    ...(markdownContent && { markdownContent }),
    ...(typeof thumbnailUrl !== 'undefined' && { thumbnailUrl }),
    ...(status && { status }),
    ...(categoryId && { categoryId }),
    ...(authorId && { authorId }),
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

  console.error('Error during update article:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during update article',
    },
    { status: 500 }
  );
}
