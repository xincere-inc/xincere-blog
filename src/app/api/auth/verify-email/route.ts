import { InternalServerError, Success, ValidationError } from '@/api/client';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request
): Promise<NextResponse<Success | ValidationError | InternalServerError>> {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    // If token is not provided, return a 400 error
    if (!token) {
      const errorResponse = {
        error: 'Token is required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find the user by the verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      const errorResponse = {
        error: 'Invalid or expired token',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Mark the user's email as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null, // Remove the verification token after successful verification
      },
    });

    // Return a success message (you can also redirect or send a confirmation email)
    const successResponse = {
      message: 'Email successfully verified',
    };
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          errors: error.errors.map((error) => ({
            path: error.path[0],
            message: error.message,
          })),
        },
        { status: 400 }
      );
    } else {
      console.error('Error during verify email:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during verify email',
        },
        { status: 500 }
      );
    }
  }
}
