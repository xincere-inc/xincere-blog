import { z } from 'zod';

export const commentQuerySchema = z.object({
  articleId: z.coerce
    .number()
    .int()
    .positive({ message: 'articleId must be a positive integer' }),
  skip: z.coerce.number().min(0).default(0),
  take: z.coerce.number().min(1).max(100).default(5),
});
