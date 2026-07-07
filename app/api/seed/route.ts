import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';
import { ArticleCategory } from '@/types';

const SYSTEM_PROMPT = `You are a Fallout 76 wiki expert. Generate accurate, comprehensive wiki articles about Fallout 76 game content.

Format your response as JSON with this exact structure:
{
  "title": "Article Title",
  "content": "Full HTML content of the article"
}

For content, use proper HTML with:
- <h2> for major sections
- <h3> for subsections  
- <p> for paragraphs
- <ul>/<li> for lists
- <table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table> for stats/data tables
- Be thorough and accurate. Include game mechanics, stats, locations, tips where relevant.
- Note when information may vary by patch or season.

Return ONLY valid JSON, no markdown code blocks.`;

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');

    const sql = neon(process.env.DATABASE_URL);
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const { topic, category } = await req.json() as { topic: string; category: ArticleCategory };
    if (!topic || !category) return NextResponse.json({ error: 'topic and category required' }, { status: 400 });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Write a comprehensive Fallout 76 wiki article about: "${topic}" (category: ${category}).` }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    const slug = slugify(parsed.title);

    const existing = await sql`SELECT id FROM articles WHERE slug = ${slug}`;
    const finalSlug = existing.length > 0 ? `${slug}-${Date.now()}` : slug;

    const result = await sql`
      INSERT INTO articles (slug, title, category, content, status, ai_generated)
      VALUES (${finalSlug}, ${parsed.title}, ${category}, ${parsed.content}, 'ai_draft', true)
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
