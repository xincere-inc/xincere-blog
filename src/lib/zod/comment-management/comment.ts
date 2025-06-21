import { z } from 'zod';

export const createCommentSchema = z.object({
  articleId: z
    .number()
    .int()
    .positive()
    .describe('The ID of the article to comment on'),
  name: z
    .string()
    .min(1, 'Name is required')
    .describe('The name of the commenter'),
  email: z
    .string()
    .email('Invalid email address')
    .describe('The email address of the commenter (not publicly displayed)'),
  content: z
    .string()
    .min(1, 'Content is required')
    .describe('The content of the comment'),
});
