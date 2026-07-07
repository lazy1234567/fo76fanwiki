'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/wiki?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'linear-gradient(180deg, #0d1e35 0%, #1a3a6a 100%)',
      borderBottom: '3px solid #C9A227',
      boxShadow: '0 2px 20px rgba(0,0,0,0.8)',
      height: '60px',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: '20px'
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36,
          background: '#C9A227',
          border: '2px solid #A8841F',
          borderRadius: '3px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', color: '#111111',
          boxShadow: '0 0 12px rgba(201,162,39,0.4)',
        }}>☢</div>
        <div>
          <div style={{
            color: '#C9A227', fontSize: '1rem', fontWeight: 700,
            letterSpacing: '0.12em', fontFamily: 'Rajdhani, sans-serif',
            lineHeight: 1, textShadow: '0 0 12px rgba(201,162,39,0.4)',
          }}>VAULT-76 WIKI</div>
          <div style={{ color: '#5a90cc', fontSize: '0.55rem', letterSpacing: '0.2em' }}>COMMUNITY KNOWLEDGE BASE</div>
        </div>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
        <input
          className="pip-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles, items, quests..."
          style={{ paddingRight: '40px', fontSize: '0.8rem' }}
        />
        <button type="submit" style={{
          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#C9A227', cursor: 'pointer', padding: 0
        }}>
          <Search size={16} />
        </button>
      </form>

      <nav style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
        {[{ href: '/wiki', label: 'BROWSE' }, { href: '/admin', label: 'MOD PANEL' }].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            color: '#7ab0e8', textDecoration: 'none',
            fontSize: '0.7rem', letterSpacing: '0.1em',
            padding: '4px 10px', border: '1px solid transparent', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#C9A227'; el.style.borderColor = '#3A6EA8'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#7ab0e8'; el.style.borderColor = 'transparent'; }}
          >{label}</Link>
        ))}
      </nav>
    </header>
  );
}
