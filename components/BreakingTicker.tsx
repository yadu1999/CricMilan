import React from 'react';
import Link from 'next/link';

interface BreakingTickerProps {
  articles: { title: string; slug: string }[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="breaking-ticker">
      <div className="container ticker-flex">
        <div className="ticker-badge">
          <span className="flame-icon">&#128293;</span>
          <span>Breaking</span>
        </div>
        <div className="ticker-marquee-window">
          <ul className="ticker-marquee-track">
            {/* Render twice for continuous animation */}
            {[0, 1].map((set) => (
              <React.Fragment key={set}>
                {articles.map((article, idx) => (
                  <li key={`${set}-${idx}`}>
                    <Link href={`/${article.slug}`}>&bull; {article.title}</Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
