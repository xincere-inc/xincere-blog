import { z } from 'zod';
import { descriptionField, nameField, slugField } from './categoryFields';

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
