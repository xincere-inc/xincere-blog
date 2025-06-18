import {
  GetArticles200Response,
  InternalServerError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { skipPaginationSchema } from '@/lib/zod/common/common';
import { ArticleStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request
): Promise<
  NextResponse<GetArticles200Response | ValidationError | InternalServerError>
> {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const parsed = skipPaginationSchema.parse({
      skip: searchParams.get('skip'),
      take: searchParams.get('take'),
    });

    const { skip, take } = parsed;

    const where = {
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
      ...(category && category !== 'all'
        ? { category: { name: category } }
        : {}),
    };
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        skip,
        take,
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          author: {
            select: { id: true, name: true }, // Adjust based on actual Author model fields
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.article.count({ where }),
    ]);

    const formatted = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      thumbnailUrl: article.thumbnailUrl,
      status: article.status,
      author: {
        id: article.author.id,
        name: article.author.name || '',
      },
      category: {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug,
      },
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      deletedAt: article.deletedAt?.toISOString() ?? null,
    }));

    return NextResponse.json(
      {
        total,
        articles: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching articles.',
      },
      { status: 500 }
    );
  }
}
