import {
  InternalServerError,
  SubmitContactFormRequest,
  Success,
  ValidationError,
} from '@/api/client';
import { sendEmail } from '@/lib/utils/send-email';
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

    // Store in database
    const submission = await prisma.contact.create({
      data: {
        companyName,
        contactName,
        email,
        phone,
        inquiry,
        privacyPolicy,
      },
    });

    // Optional: Send confirmation email
    const emailResponse = await sendEmail({
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'お問い合わせありがとうございます',
      html: `
        <p>${contactName} 様</p>
        <p>お問い合わせありがとうございます。1営業日以内に担当者からご連絡いたします。</p>
        <p><strong>会社名:</strong> ${companyName}</p>
        <p><strong>電話番号:</strong> ${phone}</p>
        <p><strong>相談内容:</strong> ${inquiry}</p>
      `,
    });

    if (!emailResponse.success) {
      // Delete the submission if email sending fails
      await prisma.contact.delete({
        where: {
          id: submission.id,
        },
      });

      return NextResponse.json(
        { error: 'Error sending confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully.',
      },
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
