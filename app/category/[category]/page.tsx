import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import { getArticlesByCategory, getPublishedArticles } from '@/lib/db';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');
  const formattedTitle = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  return {
    title: `${formattedTitle} News & Updates`,
    description: `Browse latest ${formattedTitle} news, match analyses, interviews and updates on CricMilan.in.`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');
  const formattedTitle = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  const [articles, sidebarArticles] = await Promise.all([
    getArticlesByCategory(decodedCategory, 30),
    getPublishedArticles(5)
  ]);

  const categoriesList = [
    { slug: 'cricket', label: 'Cricket' },
    { slug: 'breaking-news', label: 'Breaking News' },
    { slug: 'stories', label: 'Stories' },
    { slug: 'india', label: 'India' },
    { slug: 'world', label: 'World' },
    { slug: 'trending', label: 'Trending' }
  ];

  return (
    <div className="main-layout">
      {/* Left Column (Category News Feed) */}
      <div className="main-content">
        <div className="section-header-bar" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title-wrap">
            <div className="section-indicator"></div>
            <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
              {formattedTitle} News
            </h1>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {articles.length} stories available
          </span>
        </div>

        {/* Category Filter Pills Strip */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categoriesList.map((cat) => {
            const isSelected = cat.slug.toLowerCase() === category.toLowerCase();
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="trend-pill"
                style={{
                  background: isSelected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)'
                }}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

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
        ) : (
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
              No articles currently listed under {formattedTitle}.
            </p>
            <Link href="/" className="btn btn-accent">Return to Homepage</Link>
          </div>
        )}

        <AdBanner type="content" />
      </div>

      {/* Right Column (Sidebar) */}
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
