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
      background: 'linear-gradient(180deg, #070e18 0%, #0d1a28 100%)',
      borderBottom: '1px solid #2a4a6a',
      boxShadow: '0 2px 20px rgba(0,0,0,0.6)',
      height: '60px',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: '20px'
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #1a3a5c, #2a5a8c)',
          border: '2px solid #f0c040',
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', boxShadow: '0 0 10px rgba(240,192,64,0.3)'
        }}>☢</div>
        <div>
          <div style={{ color: '#f0c040', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'Rajdhani, sans-serif', lineHeight: 1 }}>
            VAULT-76 WIKI
          </div>
          <div style={{ color: '#8a8070', fontSize: '0.55rem', letterSpacing: '0.2em' }}>
            COMMUNITY KNOWLEDGE BASE
          </div>
        </div>
      </Link>

      {/* Search */}
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
          background: 'none', border: 'none', color: '#f0c040', cursor: 'pointer', padding: 0
        }}>
          <Search size={16} />
        </button>
      </form>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
        {[
          { href: '/wiki', label: 'BROWSE' },
          { href: '/admin', label: 'MOD PANEL' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            color: '#8a8070', textDecoration: 'none',
            fontSize: '0.7rem', letterSpacing: '0.1em',
            padding: '4px 10px',
            border: '1px solid transparent',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = '#f0c040';
              (e.target as HTMLElement).style.borderColor = '#2a4a6a';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = '#8a8070';
              (e.target as HTMLElement).style.borderColor = 'transparent';
            }}
          >{label}</Link>
        ))}
      </nav>
    </header>
  );
}
