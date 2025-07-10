import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const articleId = parseInt(id);

  if (isNaN(articleId)) {
    return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId, deletedAt: null },
    select: { id: true },
  });
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const now = new Date();
  const data = await prisma.analytics.upsert({
    where: { articleId },
    update: { viewsCount: { increment: 1 }, lastViewedAt: now },
    create: { articleId, viewsCount: 1, lastViewedAt: now },
    select: { id: true, viewsCount: true },
  });
  return NextResponse.json({ viewsCount: data.viewsCount }, { status: 200 });
}
