'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORY_LABELS, CATEGORY_ICONS, ArticleCategory } from '@/types';

const categories = Object.keys(CATEGORY_LABELS) as ArticleCategory[];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      position: 'fixed', top: '60px', left: 0, bottom: 0, width: '224px',
      background: 'linear-gradient(180deg, #12253d 0%, #111111 100%)',
      borderRight: '1px solid #3A6EA8',
      overflowY: 'auto', padding: '16px 0',
      display: 'flex', flexDirection: 'column',
    }} className="scrollbar-pip hidden md:flex">

      <div style={{ padding: '0 14px 8px', color: '#2a5a8a', fontSize: '0.6rem', letterSpacing: '0.2em' }}>CATEGORIES</div>

      {categories.map(cat => (
        <Link key={cat} href={`/wiki?category=${cat}`} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '7px 16px', color: '#5a90cc',
          textDecoration: 'none', fontSize: '0.8rem',
          borderLeft: '2px solid transparent', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#C9A227'; el.style.borderLeftColor = '#C9A227'; el.style.background = 'rgba(201,162,39,0.05)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#5a90cc'; el.style.borderLeftColor = 'transparent'; el.style.background = 'transparent'; }}
        >
          <span style={{ fontSize: '14px' }}>{CATEGORY_ICONS[cat]}</span>
          <span>{CATEGORY_LABELS[cat]}</span>
        </Link>
      ))}

      <div style={{ borderTop: '1px solid #3A6EA8', margin: '12px 0' }} />
      <div style={{ padding: '0 14px 8px', color: '#2a5a8a', fontSize: '0.6rem', letterSpacing: '0.2em' }}>TOOLS</div>

      {[
        { href: '/wiki', label: 'All Articles', icon: '📄' },
        { href: '/admin', label: 'Mod Panel', icon: '🛠' },
        { href: '/admin/seed', label: 'AI Seed', icon: '🤖' },
      ].map(({ href, label, icon }) => (
        <Link key={href} href={href} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '7px 16px',
          color: pathname === href ? '#C9A227' : '#5a90cc',
          textDecoration: 'none', fontSize: '0.8rem',
          borderLeft: `2px solid ${pathname === href ? '#C9A227' : 'transparent'}`,
          background: pathname === href ? 'rgba(201,162,39,0.05)' : 'transparent',
          transition: 'all 0.15s',
        }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span>{label}</span>
        </Link>
      ))}

      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid #3A6EA8' }}>
        <div style={{ fontSize: '0.6rem', color: '#2a5a8a', letterSpacing: '0.1em', lineHeight: 1.6 }}>
          AI SEEDED · HUMAN VERIFIED<br />NOT AFFILIATED WITH BETHESDA
        </div>
      </div>
    </aside>
  );
}
