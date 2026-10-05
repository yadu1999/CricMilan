import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import { searchArticles, getPublishedArticles } from '@/lib/db';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q || '').trim();
  return {
    title: query ? `Search: "${query}" - CricMilan` : 'Search Cricket News - CricMilan',
    description: `Search results for "${query}" on CricMilan - Cricket & News Always On.`
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  const [articles, sidebarArticles] = await Promise.all([
    query ? searchArticles(query, 30) : Promise.resolve([]),
    getPublishedArticles(5)
  ]);

  return (
    <div className="main-layout">
      <div className="main-content">
        <div className="section-header-bar" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title-wrap">
            <div className="section-indicator"></div>
            <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
              Search News &amp; Headlines
            </h1>
          </div>
        </div>

        {/* Search Input Box */}
        <form method="GET" action="/search" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search Virat Kohli, Asia Cup, IPL, India vs Australia..."
              style={{
                flex: 1,
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-accent"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Showing results for <strong>&ldquo;{query}&rdquo;</strong> ({articles.length} found)
          </div>
        )}

        {articles.length > 0 ? (
          <div className="news-grid-3">
            {articles.map((article) => (
              <article className="article-card" key={article.id}>
                <div className="card-img">
                  <Link href={`/${article.slug}`}>
                    <img
                      src={article.featured_image || '/css/placeholder.jpg'}
                      alt={article.title}
                      loading="lazy"
                    />
                  </Link>
                  <span className={`category-badge cat-${article.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {article.category}
                  </span>
                </div>
                <div className="card-content">
                  <h3>
                    <Link href={`/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p>{article.meta_description || 'Read the full story on CricMilan.in'}</p>
                  <div className="card-meta">
                    <div className="author-pill">
                      <span className="author-avatar">{article.author ? article.author.charAt(0).toUpperCase() : 'C'}</span>
                      <span>{article.author}</span>
                    </div>
                    <span className="date-text">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : query ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
              No articles matched your search query. Try another keyword.
            </p>
          </div>
        ) : null}

        <AdBanner type="content" />
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <AdBanner type="sidebar" />

        <div className="sidebar-widget">
          <div className="widget-header">
            <div className="widget-indicator"></div>
            <h3 className="widget-title">Top Stories</h3>
          </div>
          <div className="sidebar-news-list">
            {sidebarArticles.map((item, idx) => (
              <div className="sidebar-news-item" key={item.id}>
                <span className="ranking-number">0{idx + 1}</span>
                <div className="sidebar-news-img">
                  <img
                    src={item.featured_image || '/css/placeholder.jpg'}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>
                <div className="sidebar-news-details">
                  <h4>
                    <Link href={`/${item.slug}`}>{item.title}</Link>
                  </h4>
                  <span className="date-text">
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
