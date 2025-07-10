import {
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { paginationWithSearchSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type AdminGetArticlesRequest = z.infer<typeof paginationWithSearchSchema>;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) return adminAuthError;

    const body: AdminGetArticlesRequest = await req.json();
    const parsedBody = await paginationWithSearchSchema.parseAsync(body);
    const { page, limit, search } = parsedBody;

    let whereCondition: any = {};

    if (search) {
      whereCondition = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      };

      if (['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(search.toUpperCase())) {
        whereCondition.OR.push({ status: { equals: search.toUpperCase() } });
      }
    }

    const articles = await prisma.article.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalArticles = await prisma.article.count({ where: whereCondition });
    const totalPages = Math.ceil(totalArticles / limit);

    const formatted = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary ?? '',
      thumbnailUrl: article.thumbnailUrl ?? '',
      status: article.status,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      author: {
        id: article.author.id,
        name: `${article.author.firstName} ${article.author.lastName}`,
        email: article.author.email,
      },
      category: {
        id: article.category.id,
        name: article.category.name,
      },
    }));

    return NextResponse.json(
      {
        data: formatted,
        pagination: {
          page,
          limit,
          showPerPage: formatted.length,
          totalArticles,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((e) => ({
            path: e.path[0],
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error during get articles:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Error during get articles',
      },
      { status: 500 }
    );
  }
}
