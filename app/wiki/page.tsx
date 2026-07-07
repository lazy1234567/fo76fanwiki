'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Article, ArticleCategory, ArticleStatus, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import { Suspense } from 'react';

function StatusBadge({ status }: { status: ArticleStatus }) {
  if (status === 'verified') return <span className="pip-badge-verified">VERIFIED</span>;
  if (status === 'needs_review') return <span className="pip-badge-flagged">NEEDS REVIEW</span>;
  return <span className="pip-badge-ai">AI DRAFT</span>;
}

function WikiContent() {
  const params = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const category = params.get('category') as ArticleCategory | null;
  const search = params.get('search');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (search) qs.set('search', search);
    if (statusFilter) qs.set('status', statusFilter);

    fetch(`/api/articles?${qs}`)
      .then(r => r.json())
      .then(data => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, search, statusFilter]);

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#f0c040', fontSize: '1.2rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.12em', margin: 0 }}>
            {category ? `${CATEGORY_ICONS[category]} ${CATEGORY_LABELS[category]}` : search ? `SEARCH: "${search}"` : 'ALL ARTICLES'}
          </h1>
          {!loading && <p style={{ color: '#8a8070', fontSize: '0.75rem', margin: '4px 0 0' }}>{articles.length} article{articles.length !== 1 ? 's' : ''} found</p>}
        </div>
        <select
          className="pip-input"
          style={{ width: 'auto', fontSize: '0.75rem' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ArticleStatus | '')}
        >
          <option value="">All statuses</option>
          <option value="verified">Verified</option>
          <option value="ai_draft">AI Draft</option>
          <option value="needs_review">Needs Review</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: '#8a8070', textAlign: 'center', padding: '60px' }} className="pip-pulse">
          LOADING ARTICLES...
        </div>
      ) : articles.length === 0 ? (
        <div style={{ color: '#8a8070', textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
          <div>No articles found. <Link href="/admin/seed" style={{ color: '#f0c040' }}>Generate one with AI?</Link></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {articles.map(article => (
            <Link key={article.id} href={`/wiki/${article.slug}`}
              className="pip-card"
              style={{ textDecoration: 'none', padding: '14px 16px', borderRadius: '2px', display: 'block' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ color: '#e8e0c8', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '1rem' }}>
                  {article.title}
                </span>
                <StatusBadge status={article.status} />
                {article.flag_count > 0 && (
                  <span style={{ color: '#c04040', fontSize: '0.7rem' }}>⚑ {article.flag_count} flag{article.flag_count !== 1 ? 's' : ''}</span>
                )}
                <span className="category-tag" style={{ marginLeft: 'auto' }}>{CATEGORY_LABELS[article.category as ArticleCategory]}</span>
              </div>
              <div style={{ color: '#8a8070', fontSize: '0.78rem' }}>
                {article.content.replace(/<[^>]+>/g, '').slice(0, 140)}...
              </div>
              <div style={{ color: '#4a6070', fontSize: '0.65rem', marginTop: '6px' }}>
                {article.view_count} views · {new Date(article.updated_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WikiPage() {
  return (
    <Suspense fallback={<div style={{ color: '#8a8070', padding: '60px', textAlign: 'center' }} className="pip-pulse">LOADING...</div>}>
      <WikiContent />
    </Suspense>
  );
}
