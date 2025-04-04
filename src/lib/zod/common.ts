import { z } from "zod";

// Zod schema for validating single or multiple UUIDs
export const validateUUIDSSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid UUID format"))
    .min(1, "At least one ID is required"),
});

// Zod schema for validation pagination with search
export const paginationWithSearchSchema = z.object({
  page: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Page must be a positive number",
    })
    .transform((val) => (val ? Number(val) : 1)), // Default to 1 if not provided
  limit: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Limit must be a positive number",
    })
    .transform((val) => (val ? Number(val) : 10)), // Default to 10 if not provided
  search: z.string().optional(), // Optional search keyword field
});
