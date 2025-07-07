import {
  InternalServerError,
  SubmitContactFormRequest,
  Success,
  ValidationError,
} from '@/api/client';
import { contactSchema } from '@/lib/zod/contact/contact';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from './../../../lib/prisma';

export async function POST(
  req: Request
): Promise<NextResponse<Success | ValidationError | InternalServerError>> {
  try {
    const body: SubmitContactFormRequest = await req.json();
    const parsed = await contactSchema.parseAsync(body);

    const { companyName, contactName, email, phone, inquiry, privacyPolicy } =
      parsed;

    await prisma.contact.create({
      data: {
        companyName,
        contactName,
        email,
        phone,
        inquiry,
        privacyPolicy,
      },
    });

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully.',
      },
      { status: 200 }
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
      console.error('Error processing contact form:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Error processing contact form',
        },
        { status: 500 }
      );
    }
  }
}
