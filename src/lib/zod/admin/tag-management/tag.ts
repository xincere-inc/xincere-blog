import { z } from 'zod';

// Common filed name
const nameFiled = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters');

// Define the Zod schema for creating a new tag by admin
export const createTagSchema = z.object({
  name: nameFiled,
});

export const updateTagSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  name: nameFiled.optional(),
});
