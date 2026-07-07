import { neon } from '@neondatabase/serverless';
import { Article, ArticleCategory, ArticleStatus } from '@/types';

function getDB() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  return neon(process.env.DATABASE_URL);
}

export async function getArticles(opts?: {
  category?: ArticleCategory;
  status?: ArticleStatus;
  search?: string;
  limit?: number;
}): Promise<Article[]> {
  const sql = getDB();
  const { category, status, search, limit = 50 } = opts ?? {};

  let rows;
  if (category && status && search) {
    rows = await sql`SELECT * FROM articles WHERE category=${category} AND status=${status} AND (title ILIKE ${'%'+search+'%'} OR content ILIKE ${'%'+search+'%'}) ORDER BY updated_at DESC LIMIT ${limit}`;
  } else if (category && status) {
    rows = await sql`SELECT * FROM articles WHERE category=${category} AND status=${status} ORDER BY updated_at DESC LIMIT ${limit}`;
  } else if (category && search) {
    rows = await sql`SELECT * FROM articles WHERE category=${category} AND (title ILIKE ${'%'+search+'%'} OR content ILIKE ${'%'+search+'%'}) ORDER BY updated_at DESC LIMIT ${limit}`;
  } else if (status && search) {
    rows = await sql`SELECT * FROM articles WHERE status=${status} AND (title ILIKE ${'%'+search+'%'} OR content ILIKE ${'%'+search+'%'}) ORDER BY updated_at DESC LIMIT ${limit}`;
  } else if (category) {
    rows = await sql`SELECT * FROM articles WHERE category=${category} ORDER BY updated_at DESC LIMIT ${limit}`;
  } else if (status) {
    rows = await sql`SELECT * FROM articles WHERE status=${status} ORDER BY updated_at DESC LIMIT ${limit}`;
  } else if (search) {
    rows = await sql`SELECT * FROM articles WHERE (title ILIKE ${'%'+search+'%'} OR content ILIKE ${'%'+search+'%'}) ORDER BY updated_at DESC LIMIT ${limit}`;
  } else {
    rows = await sql`SELECT * FROM articles ORDER BY updated_at DESC LIMIT ${limit}`;
  }
  return rows as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const sql = getDB();
  const rows = await sql`SELECT * FROM articles WHERE slug=${slug} LIMIT 1`;
  if (!rows[0]) return null;
  await sql`UPDATE articles SET view_count = view_count + 1 WHERE slug=${slug}`;
  return rows[0] as Article;
}

export async function updateArticleStatus(id: string, status: ArticleStatus): Promise<void> {
  const sql = getDB();
  await sql`UPDATE articles SET status=${status}, updated_at=NOW() WHERE id=${id}`;
}

export async function getStats() {
  const sql = getDB();
  const [total, verified, ai_draft, flagged] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM articles`,
    sql`SELECT COUNT(*) as count FROM articles WHERE status='verified'`,
    sql`SELECT COUNT(*) as count FROM articles WHERE status='ai_draft'`,
    sql`SELECT COUNT(*) as count FROM articles WHERE flag_count > 0`,
  ]);
  return {
    total: Number(total[0].count),
    verified: Number(verified[0].count),
    ai_draft: Number(ai_draft[0].count),
    flagged: Number(flagged[0].count),
  };
}
