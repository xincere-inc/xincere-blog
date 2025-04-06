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
    .number()
    .optional()
    .refine(async (val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Page must be a positive number",
    }),
  limit: z
    .number()
    .optional()
    .refine(async (val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Limit must be a positive number",
    })
  ,
  search: z.string().optional(), // Optional search keyword field
});
