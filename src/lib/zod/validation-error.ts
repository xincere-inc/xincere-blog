// lib/utils/validation.ts

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleValidationError(parsedParams: ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      details: parsedParams.errors.map((error) => ({
        path: error.path.map(String), // Convert path elements to strings
        message: error.message,
      })),
    },
    { status: 400 }
  );
}
