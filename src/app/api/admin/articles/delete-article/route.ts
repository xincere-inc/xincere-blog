import {
    AdminDeleteArticlesRequest,
    InternalServerError,
    Success,
    UnAuthorizedError,
    ValidationError,
  } from '@/api/client';
  import { prisma } from '@/lib/prisma';
  import { authorizeAdmin } from '@/lib/utils/authorize-admin';
  import { validateIDsSchema } from '@/lib/zod/common/common';
  import { NextResponse } from 'next/server';
  import { z } from 'zod';
  
  export async function DELETE(
    req: Request
  ): Promise<
    NextResponse<UnAuthorizedError | Success | ValidationError | InternalServerError>
  > {
    try {
      // Check for admin authorization
      const adminAuthError = await authorizeAdmin();
      if (adminAuthError) {
        return adminAuthError;
      }
  
      const body: AdminDeleteArticlesRequest = await req.json();
      const { ids } = body;
  
      const parsedBody = await validateIDsSchema.safeParseAsync({ ids });
      if (!parsedBody.success) {
        return NextResponse.json(
          {
            error: 'Validation error',
            errors: parsedBody.error.errors.map((error) => ({
              path: error.path.join('.'),
              message: error.message,
            })),
          },
          { status: 400 }
        );
      }
  
      const deleteResult = await prisma.article.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
  
      return NextResponse.json(
        {
          message: `Deleted ${deleteResult.count} article(s).`,
          count: deleteResult.count,
        },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation error',
            errors: error.errors.map((error) => ({
              path: error.path.join('.'),
              message: error.message,
            })),
          },
          { status: 400 }
        );
      } else {
        console.error('Error during article deletion:', error);
        return NextResponse.json(
          {
            error: 'Internal server error',
            message: 'Error during article deletion',
          },
          { status: 500 }
        );
      }
    }
  }
  