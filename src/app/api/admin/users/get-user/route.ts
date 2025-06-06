import {
  AdminGetUsers200Response,
  AdminGetUsersRequest,
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
    | AdminGetUsers200Response
    | ValidationError
    | InternalServerError
    | UnAuthorizedError
  >
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError; // If authorization fails, return the error response
    }

    const body: AdminGetUsersRequest = await req.json();
    const parsedBody = await paginationWithSearchSchema.parseAsync(body);

    // Destructure the validated pagination and search data
    const { page, limit, search } = parsedBody;

    // Build the search condition
    let whereCondition: any = {};

    // Set up the condition for string fields using contains
    if (search) {
      whereCondition = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { gender: { contains: search, mode: 'insensitive' } },
          { country: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      };

      // Add condition for enums (e.g., role) using equals
      if (search in ['user', 'admin']) {
        // Assuming your `search` could match enum values (case-sensitive)
        whereCondition.OR.push({ role: { equals: search } });
      }
    }

    // Use findMany to get the users with the search condition
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit, // Skip records based on the current page
      take: limit, // Limit the number of records per page
      where: whereCondition, // Apply the search condition
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        country: true,
        address: true,
        role: true,
      },
    });

    // Get the total count of users matching the search condition
    const totalUsers = await prisma.user.count({
      where: whereCondition, // Use the same whereCondition for total count
    });

    const totalPages = Math.ceil(totalUsers / limit);

    // Map users to ensure all optional fields return `undefined` instead of `null`
    const sanitizedUsers = users.map((user) => ({
      ...user,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      gender: user.gender ?? '',
      country: user.country ?? '',
      address: user.address ?? '',
    }));

    return NextResponse.json(
      {
        data: sanitizedUsers,
        pagination: {
          page,
          limit,
          showPerPage: sanitizedUsers.length, // Number of users returned in this page
          totalUsers,
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
          errors: error.errors.map((err) => ({
            path: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error('Error during get users:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during get users',
        },
        { status: 500 }
      );
    }
  }
}
