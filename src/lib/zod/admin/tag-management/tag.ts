import { z } from 'zod';

// Define the Zod schema for creating a new tag by admin
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
});

export const updateTagSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
});
