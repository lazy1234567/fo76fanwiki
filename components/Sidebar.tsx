'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORY_LABELS, CATEGORY_ICONS, ArticleCategory } from '@/types';

const categories = Object.keys(CATEGORY_LABELS) as ArticleCategory[];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed', top: '60px', left: 0, bottom: 0,
      width: '224px',
      background: 'linear-gradient(180deg, #0a1520 0%, #070e18 100%)',
      borderRight: '1px solid #1a3040',
      overflowY: 'auto', padding: '16px 0',
      display: 'flex', flexDirection: 'column',
    }} className="scrollbar-pip hidden md:flex">

      <div style={{ padding: '0 12px 8px', color: '#8a8070', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
        CATEGORIES
      </div>

      {categories.map(cat => {
        const active = pathname.includes(`/wiki?`) && false; // handled via search
        return (
          <Link key={cat} href={`/wiki?category=${cat}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px',
              color: '#a0a898',
              textDecoration: 'none',
              fontSize: '0.8rem',
              borderLeft: '2px solid transparent',
              transition: 'all 0.15s',
            }}
            className="sidebar-link"
          >
            <span style={{ fontSize: '14px' }}>{CATEGORY_ICONS[cat]}</span>
            <span style={{ letterSpacing: '0.05em' }}>{CATEGORY_LABELS[cat]}</span>
          </Link>
        );
      })}

      <div style={{ borderTop: '1px solid #1a3040', margin: '12px 0' }} />
      <div style={{ padding: '0 12px 8px', color: '#8a8070', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
        TOOLS
      </div>

      {[
        { href: '/wiki', label: 'All Articles', icon: '📄' },
        { href: '/admin', label: 'Mod Panel', icon: '🛠' },
        { href: '/admin/seed', label: 'AI Seed', icon: '🤖' },
      ].map(({ href, label, icon }) => (
        <Link key={href} href={href}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 16px',
            color: pathname === href ? '#f0c040' : '#a0a898',
            textDecoration: 'none',
            fontSize: '0.8rem',
            borderLeft: `2px solid ${pathname === href ? '#f0c040' : 'transparent'}`,
            transition: 'all 0.15s',
          }}
        >
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span>{label}</span>
        </Link>
      ))}

      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid #1a3040' }}>
        <div style={{ fontSize: '0.6rem', color: '#4a6070', letterSpacing: '0.1em', lineHeight: 1.6 }}>
          AI SEEDED · HUMAN VERIFIED<br />
          NOT AFFILIATED WITH BETHESDA
        </div>
      </div>
    </aside>
  );
}
