import {
  AdminGetAuthorsRequest,
  AdminGetAuthors200Response,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { paginationWithSearchSchema } from '@/lib/zod/common/common';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(
  req: Request
): Promise<
  NextResponse<
    | AdminGetAuthors200Response
    | ValidationError
    | InternalServerError
    | UnAuthorizedError
  >
> {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) return adminAuthError;

    const body: AdminGetAuthorsRequest = await req.json();
    const parsedBody = await paginationWithSearchSchema.parseAsync(body);
    const { page, limit, search } = parsedBody;

    let whereCondition: any = {};

    if (search) {
      whereCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const authors = await prisma.author.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalAuthors = await prisma.author.count({ where: whereCondition });
    const totalPages = Math.ceil(totalAuthors / limit);

    const formatted = authors.map((author) => ({
      id: author.id,
      name: author.name,
      title: author.title,
      bio: author.bio,
      avatarUrl: author.avatarUrl ?? '',
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        data: formatted,
        pagination: {
          currentPage: page,
          limit,
          showPerPage: formatted.length,
          totalAuthors,
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

    console.error('Error during get authors:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Error during get authors',
      },
      { status: 500 }
    );
  }
}
