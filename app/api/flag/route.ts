import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
    const sql = neon(process.env.DATABASE_URL);
    const { article_id, reason, detail } = await req.json();
    if (!article_id || !reason) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    await sql`INSERT INTO flags (article_id, reason, detail) VALUES (${article_id}, ${reason}, ${detail || null})`;
    await sql`UPDATE articles SET flag_count = flag_count + 1, status = 'needs_review', updated_at = NOW() WHERE id = ${article_id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'DB error' }, { status: 500 });
  }
}
