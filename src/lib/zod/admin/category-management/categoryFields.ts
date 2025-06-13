import { z } from 'zod';

// Shared field schemas
export const nameField = z
  .string()
  .min(1, 'Name is required')
  .max(150, 'Name must be at most 150 characters');

export const slugField = z
  .string()
  .min(1, 'Slug is required')
  .max(150, 'Slug must be at most 150 characters')
  .regex(
    /^[a-z0-9-]+$/i,
    'Slug must contain only alphanumeric characters and hyphens'
  );

export const descriptionField = z
  .string()
  .max(300, 'Description must be at most 300 characters')
  .optional();
