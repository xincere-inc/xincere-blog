import { z } from 'zod';

// Zod schema for validating single or multiple UUIDs
export const validateUUIDSSchema = z.object({
  ids: z
    .array(z.string().uuid('Invalid UUID format'))
    .min(1, 'At least one ID is required'),
});

// Zod schema for validation pagination with search
export const paginationWithSearchSchema = z.object({
  page: z
    .number()
    .refine(async (val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Page must be a positive number',
    }),
  limit: z
    .number()
    .refine(async (val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Limit must be a positive number',
    }),
  search: z.string().optional(), // Optional search keyword field
});

/**
 * Schema to validate an object containing an array of numeric IDs.
 * Ensures each ID is a positive integer and that at least one ID is provided.
 * Useful for endpoints that require bulk operations on resources identified by numeric IDs.
 */
export const validateIDsSchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(1, 'At least one valid numeric ID is required'),
});
