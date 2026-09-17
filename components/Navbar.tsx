'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        window.location.href = '/search';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/category/cricket', label: 'Cricket' },
    { href: '/category/breaking-news', label: 'Breaking News' },
    { href: '/category/stories', label: 'Stories' },
    { href: '/category/india', label: 'India' },
    { href: '/category/world', label: 'World' },
    { href: '/category/trending', label: 'Trending' },
  ];

  return (
    <header>
      <div className="container header-inner">
        <div className="logo-block">
          <Link href="/">
            <div className="logo-graphic">
              <span className="ball-icon">&#127951;</span>
            </div>
            <div className="logo-text-group">
              <div className="logo-title">Cric<span>Milan</span></div>
              <div className="logo-strapline">CRICKET &amp; NEWS ALWAYS ON.</div>
            </div>
          </Link>
        </div>

        <nav>
          <ul className={`main-nav ${menuOpen ? 'mobile-open' : ''}`} id="mainNav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={isActive ? 'active' : ''}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <Link href="/search" className="search-trigger-btn" id="searchTriggerBtn">
            <span>&#128269;</span>
            <span>Search</span>
            <span className="search-shortcut-badge">/</span>
          </Link>
          <button
            className="menu-toggle-btn"
            id="menuToggle"
            aria-label="Toggle Navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
