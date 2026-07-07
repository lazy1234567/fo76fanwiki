import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';
import { ArticleCategory, ArticleStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const articles = await getArticles({
      category: params.get('category') as ArticleCategory | undefined || undefined,
      status: params.get('status') as ArticleStatus | undefined || undefined,
      search: params.get('search') || undefined,
      limit: parseInt(params.get('limit') || '50'),
    });
    return NextResponse.json(articles);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
