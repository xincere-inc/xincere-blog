import {
  AdminCreateUserRequest,
  Created,
  InternalServerError,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { sendEmail } from '@/lib/utils/send-email';
import { adminCreateUserSchema } from '@/lib/zod/admin/user-management/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export async function POST(
  req: Request
): Promise<
  NextResponse<
    UnAuthorizedError | Created | ValidationError | InternalServerError
  >
> {
  try {
    // Check for admin authorization
    const adminAuthError = await authorizeAdmin();
    if (adminAuthError) {
      return adminAuthError;
    }

    const body: AdminCreateUserRequest = await req.json();
    const parsedBody = await adminCreateUserSchema.parseAsync(body);

    const {
      email,
      password,
      firstName,
      lastName,
      address,
      gender,
      role,
      country,
    } = parsedBody;

    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserEmail) {
      return NextResponse.json(
        { error: `User already exists with this email: ${email}` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        address: address || '',
        country,
        role,
      },
    });

    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

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
        { error: 'Error sending verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          'User created successfully. A verification email has been sent.',
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
      console.error('Error during create user:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during create user',
        },
        { status: 500 }
      );
    }
  }
}
