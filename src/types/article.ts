import { ArticleStatus } from '@prisma/client';

export interface ApiArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl: string | null;
  status: ArticleStatus;
  author: {
    id: string;
    name: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
