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

    const body: AdminUpdateArticleRequest = await req.json();

    const parsed = await validateRequestBody(body);

    if (!parsed.success)
      return parsed.errorResponse as NextResponse<ValidationError>;

    const article = await prisma.article.findUnique({
      where: { id: parsed.data.id },
    });
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (await isSlugConflict(parsed.data.id, parsed.data.slug)) {
      return NextResponse.json(
        { error: 'Slug already taken by another article' },
        { status: 400 }
      );
    }

    // tagsの処理
    const { tags, ...updateData } = parsed.data;

    const updatedArticle = await prisma.article.update({
      where: { id: parsed.data.id },
      data: buildUpdatePayload(updateData, article.authorId),
    });

    // tagsが渡されている場合は紐付け直し
    if (tags && Array.isArray(tags)) {
      // 既存タグ取得
      const existingTags = await prisma.tag.findMany({
        where: { name: { in: tags } },
        select: { id: true, name: true },
      });

      const existingTagNames = new Set(existingTags.map((t) => t.name));
      const newTagNames = tags.filter((name) => !existingTagNames.has(name));

      // 新規タグ作成
      let newTags: { id: number; name: string }[] = [];
      if (newTagNames.length > 0) {
        newTags = await prisma.$transaction(
          newTagNames.map((name) => prisma.tag.create({ data: { name } }))
        );
      }

      const allTags = [...existingTags, ...newTags];

      // 記事とタグの紐付けを一度全削除して再作成
      await prisma.articleTag.deleteMany({
        where: { articleId: updatedArticle.id },
      });

      if (allTags.length > 0) {
        await prisma.articleTag.createMany({
          data: allTags.map((tag) => ({
            articleId: updatedArticle.id,
            tagId: tag.id,
          })),
          skipDuplicates: true,
        });
      }
    }

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

async function validateRequestBody(
  body: AdminUpdateArticleRequest
): Promise<
  | { success: true; data: AdminUpdateArticleRequest }
  | { success: false; errorResponse: NextResponse<ValidationError> }
> {
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

function buildUpdatePayload(
  data: AdminUpdateArticleRequest,
  defaultAuthorId: string
) {
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
    ...(categoryId && { category: { connect: { id: categoryId } } }),
    ...(authorId
      ? { author: { connect: { id: authorId } } }
      : { author: { connect: { id: defaultAuthorId } } }),
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
