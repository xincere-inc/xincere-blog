import {
  Created,
  InternalServerError,
  RegisterRequest,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/utils/send-email';
import { registerSchema } from '@/lib/zod/auth/auth';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export async function POST(
  req: Request
): Promise<NextResponse<Created | ValidationError | InternalServerError>> {
  try {
    const body: RegisterRequest = await req.json();
    const parsedBody = await registerSchema.parseAsync(body);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedBody.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'User already exists',
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, country, gender } =
      parsedBody;

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    // Get the total number of users in the database
    const totalUsers = await prisma.user.count();

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        country,
        gender,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        role: totalUsers === 0 ? 'admin' : 'user',
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${verificationToken}`;

    const emailResponse = await sendEmail({
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error sending verification email',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Register successfully, check your email for verification',
      },
      { status: 201 }
    );
  } catch (error) {
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
      console.error('Error during signup:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during registration',
        },
        { status: 500 }
      );
    }
  }
}
