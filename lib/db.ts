import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

function getSQL() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Set it in Vercel Dashboard > Settings > Environment Variables.');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// Proxy so callers can use `sql\`...\`` directly
const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const db = getSQL();
    const val = (db as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === 'function') return val.bind(db);
    return val;
  },
  apply(_target, _thisArg, args) {
    return (getSQL() as unknown as (...a: unknown[]) => unknown)(...args);
  }
});

// Tagged template literal support
const sqlFn = function(...args: Parameters<ReturnType<typeof neon>>) {
  return getSQL()(...args);
} as ReturnType<typeof neon>;

// Copy over any extra methods neon attaches
export default sqlFn;

export async function initDB() {
  const db = getSQL();
  await db`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ai_draft',
      ai_generated BOOLEAN DEFAULT true,
      flag_count INT DEFAULT 0,
      view_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS flags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      detail TEXT,
      resolved BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
