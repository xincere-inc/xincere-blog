import { z } from 'zod';

export const commentQuerySchema = z.object({
  articleId: z.coerce.number().int().positive({
    message: 'articleId must be a positive number',
  }),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
