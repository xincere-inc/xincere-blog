import {
  Created,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { AdminCreateArticleRequest } from '@/lib/zod/admin/article-management/article';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { adminCreateArticleSchema } from '@/lib/zod/admin/article-management/article';
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
  const unauthorized = await authorizeAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body: AdminCreateArticleRequest = await req.json();
    const validated = await adminCreateArticleSchema.parseAsync(body);

    const { slug, tags, ...articleData } = validated;

    const duplicate = await prisma.article.findUnique({ where: { slug } });
    if (duplicate) {
      return NextResponse.json(
        { error: `Article already exists with this slug: ${slug}` },
        { status: 400 }
      );
    }

    const createdArticle = await prisma.article.create({
      data: {
        ...articleData,
        slug,
      },
    });

    if (tags && tags.length > 0) {
      const existingTags = await prisma.tag.findMany({
        where: { name: { in: tags } },
        select: { id: true, name: true },
      });

      const existingTagNames = existingTags.map((t) => t.name);
      const newTagNames = tags.filter(
        (name) => !existingTagNames.includes(name)
      );

      if (newTagNames.length > 0) {
        const newTags = await prisma.$transaction(
          newTagNames.map((name) => prisma.tag.create({ data: { name } }))
        );
        existingTags.push(...newTags);
      }

      // Now link tags to the article
      const articleTags = existingTags.map((tag) => ({
        articleId: createdArticle.id,
        tagId: tag.id,
      }));

      await prisma.articleTag.createMany({
        data: articleTags,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      { message: 'Article created successfully.' },
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

  console.error('Error during create article:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during create article',
    },
    { status: 500 }
  );
}
