import { z } from 'zod';

// Define the Zod schema for creating a new category by admin
export const adminCreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(150, 'Name must be at most 150 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(150, 'Slug must be at most 150 characters')
    .regex(
      /^[a-z0-9-]+$/i,
      'Slug must contain only alphanumeric characters and hyphens'
    ),
  description: z
    .string()
    .max(300, 'Description must be at most 300 characters')
    .optional(),
});
