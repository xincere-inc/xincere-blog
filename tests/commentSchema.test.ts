import { describe, expect, test } from '@jest/globals';
import { commentQuerySchema } from '../src/lib/zod/comment/comment';
import { skipPaginationSchema } from '../src/lib/zod/common/common';
import { adminCreateCategorySchema } from '../src/lib/zod/admin/category-management/category';

describe('commentQuerySchema', () => {
  test('parses valid query', () => {
    const parsed = commentQuerySchema.parse({
      articleId: 1,
      skip: '2',
      take: '5',
    });
    expect(parsed).toEqual({ articleId: 1, skip: 2, take: 5 });
  });

  test('fails with invalid articleId', () => {
    expect(() => commentQuerySchema.parse({ articleId: 0 })).toThrow();
  });
});

describe('skipPaginationSchema', () => {
  test('uses defaults when values missing', () => {
    const parsed = skipPaginationSchema.parse({});
    expect(parsed).toEqual({ skip: 0, take: 5 });
  });
});

describe('adminCreateCategorySchema', () => {
  test('fails when name missing', async () => {
    await expect(
      adminCreateCategorySchema.parseAsync({
        slug: 'slug',
        description: 'desc',
      })
    ).rejects.toThrow();
  });
});
