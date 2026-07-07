import { NextRequest, NextResponse } from 'next/server';
import { updateArticleStatus } from '@/lib/articles';
import { ArticleStatus } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json() as { id: string; status: ArticleStatus };
    await updateArticleStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'error' }, { status: 500 });
  }
}
