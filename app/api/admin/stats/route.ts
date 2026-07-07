import { NextResponse } from 'next/server';
import { getStats } from '@/lib/articles';

export async function GET() {
  try {
    return NextResponse.json(await getStats());
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'error' }, { status: 500 });
  }
}
