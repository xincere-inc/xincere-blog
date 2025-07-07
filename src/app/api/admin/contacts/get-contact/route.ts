import {
  AdminGetContacts200Response,
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
    | AdminGetContacts200Response
    | ValidationError
    | InternalServerError
    | UnAuthorizedError
  >
> {
  try {
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) return adminAuthError;

    const { searchParams } = new URL(req.url);
    const body = {
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
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const contacts = await prisma.contact.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalContacts = await prisma.contact.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalContacts / limit);

    const formatted = contacts.map((contact) => ({
      id: contact.id,
      companyName: contact.companyName,
      contactName: contact.contactName,
      email: contact.email,
      phone: contact.phone,
      inquiry: contact.inquiry,
      status: contact.status,
      createdAt: contact.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        data: formatted,
        pagination: {
          page,
          limit,
          showPerPage: formatted.length,
          totalContacts,
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

    console.error('Error during get contacts:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Error during get contacts',
      },
      { status: 500 }
    );
  }
}
