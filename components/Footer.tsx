import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>Cric<span>Milan</span></h2>
            <p>
              CricMilan is a premium cricket news and sports stories network delivering real-time updates, tactical breakdown, breaking match reports, and global tournament analysis.
            </p>
            <div className="server-status-indicator" style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
              <span className="status-dot-green"></span>
              <span>ALL SYSTEMS OPERATIONAL &bull; 24/7 LIVE</span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/category/cricket">Cricket</Link></li>
              <li><Link href="/category/breaking-news">Breaking News</Link></li>
              <li><Link href="/category/stories">Stories</Link></li>
              <li><Link href="/category/india">India</Link></li>
              <li><Link href="/category/world">World</Link></li>
              <li><Link href="/category/trending">Trending</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Information</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions">Terms &amp; Conditions</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
              <li><Link href="/sitemap.xml" target="_blank">XML Sitemap</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Hot Topics</h3>
            <ul>
              <li><Link href="/search?q=Kohli">Virat Kohli Century</Link></li>
              <li><Link href="/search?q=Asia+Cup">Asia Cup Highlights</Link></li>
              <li><Link href="/search?q=IPL">IPL Auctions</Link></li>
              <li><Link href="/search?q=ICC">ICC World Cup</Link></li>
              <li><Link href="/search?q=Team+India">Team India Ranking</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {year} <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}><strong>cricmilan.in</strong></Link>. All Rights Reserved. Cricket &amp; News Always On.
          </div>
          <div className="footer-bottom-links">
            <Link href="/admin/login" className="footer-admin-link">⚙ Admin Portal</Link>
            <span>Design: CricMilan Broadcast Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
