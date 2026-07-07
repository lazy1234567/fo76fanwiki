'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article, ArticleStatus, CATEGORY_LABELS, ArticleCategory } from '@/types';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, ai_draft: 0, flagged: 0 });
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [flaggedRes, statsRes] = await Promise.all([
      fetch('/api/articles?status=needs_review'),
      fetch('/api/admin/stats'),
    ]);
    const flagged = await flaggedRes.json();
    const statsData = await statsRes.json();
    setArticles(flagged);
    setStats(statsData);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function updateStatus(id: string, status: ArticleStatus) {
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadData();
  }

  return (
    <div>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #1a3040', paddingBottom: '16px' }}>
        <h1 style={{ color: '#f0c040', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.12em', margin: '0 0 4px' }}>
          🛠 MODERATOR PANEL
        </h1>
        <p style={{ color: '#8a8070', fontSize: '0.8rem', margin: 0 }}>Review flagged articles and manage content status.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'TOTAL ARTICLES', value: stats.total, color: '#e8e0c8' },
          { label: 'VERIFIED', value: stats.verified, color: '#4a9a60' },
          { label: 'AI DRAFTS', value: stats.ai_draft, color: '#7ab8e8' },
          { label: 'FLAGGED', value: stats.flagged, color: '#c04040' },
        ].map(({ label, value, color }) => (
          <div key={label} className="pip-card" style={{ padding: '16px', borderRadius: '2px', textAlign: 'center' }}>
            <div style={{ color, fontSize: '1.8rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>{value}</div>
            <div style={{ color: '#8a8070', fontSize: '0.6rem', letterSpacing: '0.15em', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <Link href="/admin/seed" className="pip-btn pip-btn-primary" style={{ textDecoration: 'none' }}>
          🤖 Generate AI Article
        </Link>
        <Link href="/wiki" className="pip-btn" style={{ textDecoration: 'none' }}>
          Browse All Articles
        </Link>
      </div>

      {/* Flagged articles */}
      <h2 style={{ color: '#f0c040', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '12px', borderBottom: '1px solid #1a3040', paddingBottom: '8px' }}>
        PENDING REVIEW ({articles.length})
      </h2>

      {loading ? (
        <div style={{ color: '#8a8070', textAlign: 'center', padding: '40px' }} className="pip-pulse">LOADING...</div>
      ) : articles.length === 0 ? (
        <div style={{ color: '#8a8070', textAlign: 'center', padding: '40px' }}>
          ✓ Nothing in the review queue.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {articles.map(article => (
            <div key={article.id} className="pip-card" style={{ padding: '14px 16px', borderRadius: '2px', borderColor: '#c04040' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: '#e8e0c8', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>
                    {article.title}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="category-tag">{CATEGORY_LABELS[article.category as ArticleCategory]}</span>
                    <span style={{ color: '#c04040', fontSize: '0.7rem' }}>⚑ {article.flag_count} flag{article.flag_count !== 1 ? 's' : ''}</span>
                    <span style={{ color: '#4a6070', fontSize: '0.7rem' }}>{new Date(article.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Link href={`/wiki/${article.slug}`} className="pip-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                    <Eye size={12} /> VIEW
                  </Link>
                  <button className="pip-btn" onClick={() => updateStatus(article.id, 'verified')}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#4a9a60', color: '#4a9a60', fontSize: '0.7rem' }}>
                    <CheckCircle size={12} /> APPROVE
                  </button>
                  <button className="pip-btn" onClick={() => updateStatus(article.id, 'rejected')}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#c04040', color: '#c04040', fontSize: '0.7rem' }}>
                    <XCircle size={12} /> REJECT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
