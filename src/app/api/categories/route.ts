import {
  GetCategories200Response,
  InternalServerError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { skipPaginationSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request
): Promise<
  NextResponse<GetCategories200Response | ValidationError | InternalServerError>
> {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = skipPaginationSchema.parse({
      skip: searchParams.get('skip'),
      take: searchParams.get('take'),
    });

    const { skip, take } = parsed;

    const categories = await prisma.category.findMany({
      skip,
      take,
      where: {
        deletedAt: null,
        articles: {
          some: {
            status: 'PUBLISHED',
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = categories.map((category) => ({
      id: category?.id,
      name: category?.name,
      slug: category?.slug,
      description: category?.description ?? '',
      createdAt: category?.createdAt ? category.createdAt.toISOString() : '',
      updatedAt: category?.updatedAt ? category.updatedAt.toISOString() : '',
      deletedAt: category?.deletedAt ? category.deletedAt.toISOString() : null,
    }));

    return NextResponse.json(
      {
        categories: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((e) => ({
            path: e.path[0]?.toString(),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching categories.',
      },
      { status: 500 }
    );
  }
}
