import {
  AdminGetCategories200Response,
  AdminGetCategoriesRequest,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { paginationWithSearchSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request
): Promise<
  NextResponse<
    | AdminGetCategories200Response
    | ValidationError
    | InternalServerError
    | UnAuthorizedError
  >
> {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) return adminAuthError;

    const { searchParams } = new URL(req.url);
    const body: AdminGetCategoriesRequest = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || undefined,
    };

    const parsedBody = await paginationWithSearchSchema.parseAsync(body);

    const { page, limit, search } = parsedBody;

    let whereCondition = {};

    if (search) {
      whereCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const categories = await prisma.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCategories = await prisma.category.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalCategories / limit);

    const formatted = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      deletedAt: category.deletedAt?.toISOString() ?? null,
    }));

    return NextResponse.json(
      {
        data: formatted,
        pagination: {
          page,
          limit,
          showPerPage: formatted.length,
          totalCategories,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
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

    console.error('Error during get categories:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Error during get categories',
      },
      { status: 500 }
    );
  }
}
