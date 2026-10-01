'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubNavItem {
  href: string;
  label: string;
  badge?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  badge?: string;
  subItems?: SubNavItem[];
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null);
  const [mobileSearch, setMobileSearch] = useState('');

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMenuOpen(false);
    setExpandedSubMenu(null);
  }, [pathname]);

  // Global keyboard shortcuts: '/' for search, 'Escape' to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        return;
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        window.location.href = '/search';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const navItems: NavItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: '🏠'
    },
    {
      href: '/category/cricket',
      label: 'Cricket',
      icon: '🏏',
      subItems: [
        { href: '/category/cricket', label: 'All Cricket News', badge: 'Latest' },
        { href: '/search?q=IPL', label: 'IPL 2026 Season', badge: 'Hot' },
        { href: '/search?q=Asia+Cup', label: 'Asia Cup Highlights' },
        { href: '/search?q=Team+India', label: 'Team India Matches' },
        { href: '/search?q=ICC', label: 'ICC Tournaments' },
      ]
    },
    {
      href: '/category/breaking-news',
      label: 'Breaking News',
      icon: '⚡',
      badge: 'LIVE'
    },
    {
      href: '/category/stories',
      label: 'Stories',
      icon: '📖',
      subItems: [
        { href: '/category/stories', label: 'All In-Depth Stories' },
        { href: '/search?q=Grassroots', label: 'Grassroots Stories' },
        { href: '/search?q=Kohli', label: 'Player Spotlights' },
      ]
    },
    {
      href: '/category/india',
      label: 'India',
      icon: '🇮🇳'
    },
    {
      href: '/category/world',
      label: 'World',
      icon: '🌍'
    },
    {
      href: '/category/trending',
      label: 'Trending',
      icon: '🔥',
      subItems: [
        { href: '/category/trending', label: 'All Trending' },
        { href: '/search?q=Kohli', label: '#ViratKohli51st' },
        { href: '/search?q=Asia+Cup', label: '#AsiaCupThriller' },
        { href: '/search?q=IPL', label: '#IPL2026Auction' },
      ]
    },
  ];

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(mobileSearch.trim())}`;
      setMenuOpen(false);
    }
  };

  const toggleSubMenu = (label: string) => {
    setExpandedSubMenu(prev => (prev === label ? null : label));
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <div className="logo-block">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <div className="logo-graphic">
              <span className="ball-icon">&#127951;</span>
            </div>
            <div className="logo-text-group">
              <div className="logo-title">Cric<span>Milan</span></div>
              <div className="logo-strapline">CRICKET &amp; NEWS ALWAYS ON.</div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Menu with Dropdown support */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="main-nav" id="desktopMainNav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const hasSub = !!item.subItems && item.subItems.length > 0;
              return (
                <li key={item.href} className={`main-nav-item ${hasSub ? 'nav-item-dropdown' : ''}`}>
                  <Link
                    href={item.href}
                    className={`main-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span>{item.label}</span>
                    {hasSub && <span className="desktop-chevron" aria-hidden="true">&#9662;</span>}
                  </Link>

                  {/* Desktop Dropdown Card */}
                  {hasSub && (
                    <div className="desktop-dropdown-card">
                      <div className="dropdown-card-inner">
                        {item.subItems!.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href + sub.label}
                              href={sub.href}
                              className={`dropdown-card-item ${isSubActive ? 'active' : ''}`}
                            >
                              <span className="dropdown-card-title">{sub.label}</span>
                              {sub.badge && <span className="dropdown-card-badge">{sub.badge}</span>}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Header Action Buttons (Search & Mobile Menu Toggle) */}
        <div className="header-actions">
          <Link href="/search" className="search-trigger-btn" id="searchTriggerBtn" aria-label="Search articles">
            <span className="search-btn-icon">&#128269;</span>
            <span className="search-btn-label">Search</span>
            <span className="search-shortcut-badge">/</span>
          </Link>

          <button
            className={`menu-toggle-btn ${menuOpen ? 'active' : ''}`}
            id="menuToggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobileNavDrawer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-toggle-icon">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {menuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div
          className="mobile-nav-drawer"
          id="mobileNavDrawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Quick Search inside Mobile Menu */}
          <form className="mobile-search-box" onSubmit={handleMobileSearchSubmit}>
            <span className="mobile-search-icon" aria-hidden="true">&#128269;</span>
            <input
              type="search"
              placeholder="Search cricket, news, teams..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              className="mobile-search-input"
              aria-label="Search cricket articles"
            />
            <button type="submit" className="mobile-search-btn">
              Go
            </button>
          </form>

          {/* Mobile Menu Options List */}
          <ul className="mobile-nav-list" id="mainNav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const hasSub = !!item.subItems && item.subItems.length > 0;
              const isExpanded = expandedSubMenu === item.label;

              return (
                <li key={item.href} className="mobile-nav-item">
                  <div className="mobile-nav-item-header">
                    <Link
                      href={item.href}
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobile-nav-icon">{item.icon}</span>
                      <span className="mobile-nav-label">{item.label}</span>
                      {item.badge && <span className="mobile-nav-badge">{item.badge}</span>}
                    </Link>

                    {hasSub && (
                      <button
                        type="button"
                        className={`mobile-submenu-toggle ${isExpanded ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubMenu(item.label);
                        }}
                        aria-label={`Toggle ${item.label} sub-menu options`}
                        aria-expanded={isExpanded}
                      >
                        <span className="chevron-icon">{isExpanded ? '▴' : '▾'}</span>
                      </button>
                    )}
                  </div>

                  {/* Sub-menu options list */}
                  {hasSub && (
                    <ul
                      className={`mobile-submenu-list ${isExpanded ? 'open' : ''}`}
                      aria-label={`${item.label} sub-options`}
                    >
                      {item.subItems!.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.href + sub.label} className="mobile-submenu-item">
                            <Link
                              href={sub.href}
                              className={`mobile-submenu-link ${isSubActive ? 'active' : ''}`}
                              onClick={() => setMenuOpen(false)}
                            >
                              <span className="submenu-bullet">&#9679;</span>
                              <span className="submenu-label">{sub.label}</span>
                              {sub.badge && <span className="submenu-badge">{sub.badge}</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Quick Trending Tags */}
          <div className="mobile-quick-trends">
            <span className="mobile-quick-trends-label">
              <span aria-hidden="true">&#128293;</span> Hot Topics:
            </span>
            <div className="mobile-quick-trends-pills">
              <Link href="/search?q=Kohli" onClick={() => setMenuOpen(false)}>#ViratKohli51st</Link>
              <Link href="/search?q=Asia+Cup" onClick={() => setMenuOpen(false)}>#AsiaCupThriller</Link>
              <Link href="/search?q=IPL" onClick={() => setMenuOpen(false)}>#IPL2026Auction</Link>
              <Link href="/search?q=India" onClick={() => setMenuOpen(false)}>#TeamIndiaRank1</Link>
            </div>
          </div>

          {/* Quick Informational & Admin Links */}
          <div className="mobile-nav-footer">
            <Link href="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link href="/privacy-policy" onClick={() => setMenuOpen(false)}>Privacy</Link>
            <Link href="/terms-conditions" onClick={() => setMenuOpen(false)}>Terms</Link>
            <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="mobile-admin-badge">
              ⚙ Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

