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
): Promise<
  NextResponse<
    Success | ValidationError | InternalServerError | UnAuthorizedError
  >
> {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const body: AdminUpdateArticleRequest = await req.json();

    const parsed = await adminUpdateArticleSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: parsed.error.errors.map((error) => ({
            path: error.path.join('.'),
            message: error.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      id,
      title,
      slug,
      summary,
      content,
      markdownContent,
      thumbnailUrl,
      status,
      categoryId,
      authorId,
    } = parsed.data;

    const articleExists = await prisma.article.findUnique({ where: { id } });
    if (!articleExists) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (slug) {
      const slugConflict = await prisma.article.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'Slug already taken by another article' },
          { status: 400 }
        );
      }
    }

    const updatedFields: Partial<{
      title: string;
      slug: string;
      summary: string;
      content: string;
      markdownContent: string;
      thumbnailUrl: string | null;
      status: ArticleStatus;
      categoryId: number;
      authorId: string;
    }> = {};

    if (title) updatedFields.title = title;
    if (slug) updatedFields.slug = slug;
    if (summary) updatedFields.summary = summary;
    if (content) updatedFields.content = content;
    if (markdownContent) updatedFields.markdownContent = markdownContent;
    if (typeof thumbnailUrl !== 'undefined')
      updatedFields.thumbnailUrl = thumbnailUrl;
    if (status) updatedFields.status = status;
    if (categoryId) updatedFields.categoryId = categoryId;
    if (authorId) updatedFields.authorId = authorId;

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updatedFields,
    });

    return NextResponse.json(
      {
        message: 'Article updated successfully',
        article: {
          id: updatedArticle.id,
          title: updatedArticle.title,
          slug: updatedArticle.slug,
          status: updatedArticle.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message,
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
}
