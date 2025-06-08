import {
  ForgetPasswordRequest,
  InternalServerError,
  Success,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/utils/send-email';
import { emailSchema } from '@/lib/zod/auth/auth';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export async function POST(
  req: Request
): Promise<NextResponse<Success | ValidationError | InternalServerError>> {
  try {
    const body: ForgetPasswordRequest = await req.json();

    const parsedBody = await emailSchema.parseAsync(body);

    const { email } = parsedBody;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Email not found.' }, { status: 404 });
    }

    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${verificationToken}`;

    const emailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Thank you for registering!</p>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
      `,
    };

    const emailResponse = await sendEmail(emailOptions);

    if (!emailResponse.success) {
      return NextResponse.json(
        { error: 'Error sending verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
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
      console.error('Error during verify email request:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error during verify email request',
        },
        { status: 500 }
      );
    }
  }
}
