import { z } from 'zod';

// Define the Zod schema for creating a new article by admin
export const adminCreateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must be at most 150 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(150, 'Slug must be at most 150 characters'),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(300, 'Summary must be at most 300 characters'),
  content: z.string().min(1, 'Content is required'),
  markdownContent: z.string().min(1, 'Markdown content is required'),
  thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
    errorMap: () => ({
      message: "Status must be one of 'DRAFT', 'PUBLISHED', or 'ARCHIVED'",
    }),
  }),
  // authorId: z.string().uuid('Author ID must be a valid UUID'),
  categoryId: z.number().int('Category ID must be an integer'),
  tags: z.array(z.string()).optional(),
});

// Define the Zod schema for updating an existing article by admin
export const adminUpdateArticleSchema = z.object({
  id: z.number().int('Article ID must be an integer'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must be at most 150 characters')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(150, 'Slug must be at most 150 characters')
    .optional(),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(300, 'Summary must be at most 300 characters')
    .optional(),
  content: z.string().min(1, 'Content is required').optional(),
  markdownContent: z.string().min(1, 'Markdown content is required').optional(),
  thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL').optional(),
  status: z
    .enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
      errorMap: () => ({
        message: "Status must be one of 'DRAFT', 'PUBLISHED', or 'ARCHIVED'",
      }),
    })
    .optional(),
  // authorId: z.string().uuid('Author ID must be a valid UUID').optional(),
  categoryId: z.number().int('Category ID must be an integer').optional(),
  tags: z.array(z.string()).optional(),
});
