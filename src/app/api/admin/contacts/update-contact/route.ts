import {
  InternalServerError,
  Success,
  UnAuthorizedError,
  ValidationError,
} from '@/api/client';
import { prisma } from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/utils/authorize-admin';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { ContactStatus } from '@prisma/client';

// Contactのstatusのみ更新できるAPI
const updateContactStatusSchema = z.object({
  id: z.number(),
  status: z.enum([
    ContactStatus.OPEN,
    ContactStatus.INPROGRESS,
    ContactStatus.CLOSED,
  ]),
});

export async function PUT(
  req: Request
): Promise<
  NextResponse<
    Success | ValidationError | InternalServerError | UnAuthorizedError
  >
> {
  try {
    const authError = await authorizeAdmin();
    if (authError) return authError;

    const body = await req.json();

    const parsed = await validateRequestBody(body);

    if (!parsed.success)
      return parsed.errorResponse as NextResponse<ValidationError>;

    const contact = await prisma.contact.findUnique({
      where: { id: parsed.data.id },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });

    const responsePayload = {
      message: 'Contact status updated successfully',
      contact: {
        id: updatedContact.id,
        status: updatedContact.status,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    return handleUnexpectedError(error);
  }
}

async function validateRequestBody(
  body: any
): Promise<
  | { success: true; data: z.infer<typeof updateContactStatusSchema> }
  | { success: false; errorResponse: NextResponse<ValidationError> }
> {
  const result = await updateContactStatusSchema.safeParseAsync(body);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errorResponse: NextResponse.json(
        {
          error: 'Validation error',
          errors: result.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      ),
    };
  }
}

function handleUnexpectedError(error: any) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  console.error('Error during update contact:', error);
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: 'Error during update contact',
    },
    { status: 500 }
  );
}
