'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORY_LABELS, CATEGORY_ICONS, ArticleCategory } from '@/types';

const categories = Object.keys(CATEGORY_LABELS) as ArticleCategory[];

const SUGGESTIONS: Partial<Record<ArticleCategory, string[]>> = {
  weapons: ['Fixer', 'Handmade Rifle', 'Gauss Minigun', 'Railway Rifle', 'Plasma Cutter'],
  items: ['Fusion Core', 'Stimpak', 'Rad-X', 'Nuka-Cola Quantum', 'Legendary Modules'],
  locations: ['Whitespring Resort', 'Vault 76', 'Watoga', 'Foundation', 'Crater'],
  quests: ['Wastelanders', 'Atlantic City', 'Steel Dawn', 'One Wasteland For All'],
  creatures: ['Scorchbeast Queen', 'Wendigo', 'Grafton Monster', 'Mothman', 'Mega Sloth'],
  builds: ['Bloodied Build', 'Full Health PA Build', 'Commando Build', 'Heavy Gunner Build'],
  events: ['Radiation Rumble', 'Scorched Earth', 'A Colossal Problem', 'Eviction Notice'],
  perks: ['Bloodied', 'Starched Genes', 'Concentrated Fire', 'Overly Generous'],
};

export default function SeedPage() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('items');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic.trim(), category }),
    });

    if (res.ok) {
      const article = await res.json();
      router.push(`/wiki/${article.slug}`);
    } else {
      const err = await res.json();
      setError(err.error || 'Generation failed');
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #1a3040', paddingBottom: '16px' }}>
        <h1 style={{ color: '#f0c040', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.12em', margin: '0 0 4px' }}>
          🤖 AI ARTICLE GENERATOR
        </h1>
        <p style={{ color: '#8a8070', fontSize: '0.8rem', margin: 0 }}>
          Enter a Fallout 76 topic and select a category. Claude will generate a full wiki article, saved as an AI draft for community review.
        </p>
      </div>

      <div className="pip-card" style={{ padding: '24px', borderRadius: '2px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ color: '#8a8070', fontSize: '0.7rem', letterSpacing: '0.15em', display: 'block', marginBottom: '6px' }}>
              CATEGORY
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 4px',
                    background: category === cat ? 'rgba(240,192,64,0.15)' : 'transparent',
                    border: `1px solid ${category === cat ? '#f0c040' : '#2a4a6a'}`,
                    color: category === cat ? '#f0c040' : '#8a8070',
                    cursor: 'pointer',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                  }}>
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{CATEGORY_LABELS[cat].toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: '#8a8070', fontSize: '0.7rem', letterSpacing: '0.15em', display: 'block', marginBottom: '6px' }}>
              TOPIC
            </label>
            <input
              className="pip-input"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder={`e.g. ${SUGGESTIONS[category]?.[0] ?? 'topic name'}`}
              onKeyDown={e => e.key === 'Enter' && !loading && generate()}
            />
          </div>

          {SUGGESTIONS[category] && (
            <div>
              <div style={{ color: '#8a8070', fontSize: '0.65rem', letterSpacing: '0.1em', marginBottom: '6px' }}>SUGGESTIONS:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SUGGESTIONS[category]!.map(s => (
                  <button key={s} onClick={() => setTopic(s)}
                    className="pip-btn"
                    style={{ padding: '3px 10px', fontSize: '0.7rem' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ color: '#c04040', fontSize: '0.8rem', padding: '8px 12px', background: 'rgba(192,64,64,0.1)', border: '1px solid #c04040' }}>
              ✗ {error}
            </div>
          )}

          <button
            className="pip-btn pip-btn-primary"
            onClick={generate}
            disabled={loading || !topic.trim()}
            style={{ marginTop: '4px', opacity: loading || !topic.trim() ? 0.6 : 1 }}
          >
            {loading ? (
              <span className="pip-pulse">⏳ GENERATING ARTICLE...</span>
            ) : (
              '🤖 GENERATE ARTICLE'
            )}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <Link href="/admin" style={{ color: '#8a8070', fontSize: '0.75rem', textDecoration: 'none' }}>
          ← Back to Mod Panel
        </Link>
      </div>
    </div>
  );
}
