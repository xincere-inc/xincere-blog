import { z } from 'zod';

// Shared field schemas
const nameField = z
  .string()
  .min(1, 'Name is required')
  .max(150, 'Name must be at most 150 characters');

const slugField = z
  .string()
  .min(1, 'Slug is required')
  .max(150, 'Slug must be at most 150 characters')
  .regex(
    /^[a-z0-9-]+$/i,
    'Slug must contain only alphanumeric characters and hyphens'
  );

const descriptionField = z
  .string()
  .max(300, 'Description must be at most 300 characters')
  .optional();

// Define the Zod schema for creating a new category by admin
export const adminCreateCategorySchema = z.object({
  name: nameField,
  slug: slugField,
  description: descriptionField,
});

// Define the Zod schema for updating a category by admin
export const adminUpdateCategorySchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  name: nameField.optional(),
  slug: slugField.optional(),
  description: descriptionField,
});
