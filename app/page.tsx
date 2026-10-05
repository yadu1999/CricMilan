import React from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { getPublishedArticles, getArticlesByCategory } from '@/lib/db';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function HomePage() {
  const allArticles = await getPublishedArticles(20);
  const featuredArticles = allArticles.slice(0, 4);
  const latestArticles = allArticles;
  const cricketArticles = await getArticlesByCategory('Cricket', 6);
  const indiaArticles = await getArticlesByCategory('India', 6);

  const primary = featuredArticles[0];
  const secondaryStories = featuredArticles.slice(1);

  return (
    <>
      {/* Hero Section (Bento Magazine Layout) */}
      <section className="hero-bento-grid">
        {primary ? (
          <>
            {/* Primary Big Story */}
            <div className="hero-spotlight-card">
              <Link href={`/${primary.slug}`}>
                <img
                  className="hero-bg-img"
                  src={primary.featured_image || '/css/placeholder.jpg'}
                  alt={primary.title}
                />
                <div className="hero-gradient-overlay"></div>
                <div className="hero-spotlight-content">
                  <div className="hero-tag-row">
                    <span className={`category-badge cat-${primary.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {primary.category}
                    </span>
                    <span className="read-time-badge">&#9201; 4 min read</span>
                  </div>
                  <h1 className="hero-main-title">{primary.title}</h1>
                  <div className="hero-meta-row">
                    <div className="author-pill">
                      <span className="author-avatar">{primary.author ? primary.author.charAt(0).toUpperCase() : 'C'}</span>
                      <span>By {primary.author}</span>
                    </div>
                    <span>&bull;</span>
                    <span>
                      {new Date(primary.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Secondary Stories Column */}
            <div className="hero-secondary-col">
              {secondaryStories.map((article) => (
                <div className="bento-sub-card" key={article.id}>
                  <div className="hero-sub-img-wrap">
                    <Link href={`/${article.slug}`}>
                      <img
                        src={article.featured_image || '/css/placeholder.jpg'}
                        alt={article.title}
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div className="hero-sub-body">
                    <div>
                      <span
                        className={`category-badge cat-${article.category.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{ fontSize: '0.6rem', padding: '0.15rem 0.45rem', marginBottom: '0.4rem' }}
                      >
                        {article.category}
                      </span>
                      <h3>
                        <Link href={`/${article.slug}`}>{article.title}</Link>
                      </h3>
                    </div>
                    <div className="hero-sub-meta">
                      <span>
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span>&bull;</span>
                      <span>By {article.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="hero-spotlight-card" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No articles published yet. Please login to the admin panel to add stories.</p>
          </div>
        )}
      </section>

      {/* Homepage Main Grid Layout */}
      <div className="main-layout">
        {/* Left Column (Feeds) */}
        <div className="main-content">
          {/* Latest Articles Section */}
          <div className="section-header-bar">
            <div className="section-title-wrap">
              <div className="section-indicator"></div>
              <h2 className="section-title">Latest Articles</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated live</span>
          </div>

          <div className="news-grid-3">
            {latestArticles.map((article) => (
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

          {/* In-feed Banner Ad */}
          <AdBanner type="content" />

          {/* Cricket Category Section */}
          {cricketArticles.length > 0 && (
            <>
              <div className="section-header-bar" style={{ marginTop: '2rem' }}>
                <div className="section-title-wrap">
                  <div className="section-indicator" style={{ background: '#10b981' }}></div>
                  <h2 className="section-title">Cricket Spotlight</h2>
                </div>
                <Link href="/category/cricket" className="view-all-link">View All Cricket &rarr;</Link>
              </div>
              <div className="news-grid-3">
                {cricketArticles.map((article) => (
                  <article className="article-card" key={article.id}>
                    <div className="card-img">
                      <Link href={`/${article.slug}`}>
                        <img
                          src={article.featured_image || '/css/placeholder.jpg'}
                          alt={article.title}
                          loading="lazy"
                        />
                      </Link>
                      <span className="category-badge cat-cricket">{article.category}</span>
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
            </>
          )}

          {/* India Category Section */}
          {indiaArticles.length > 0 && (
            <>
              <div className="section-header-bar" style={{ marginTop: '2rem' }}>
                <div className="section-title-wrap">
                  <div className="section-indicator" style={{ background: '#f59e0b' }}></div>
                  <h2 className="section-title">Team India Highlights</h2>
                </div>
                <Link href="/category/india" className="view-all-link">View All India News &rarr;</Link>
              </div>
              <div className="news-grid-3">
                {indiaArticles.map((article) => (
                  <article className="article-card" key={article.id}>
                    <div className="card-img">
                      <Link href={`/${article.slug}`}>
                        <img
                          src={article.featured_image || '/css/placeholder.jpg'}
                          alt={article.title}
                          loading="lazy"
                        />
                      </Link>
                      <span className="category-badge cat-india">{article.category}</span>
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
            </>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <aside className="sidebar">
          {/* Sidebar Rectangle Ad */}
          <AdBanner type="sidebar" />

          {/* Power Rankings / Top 5 Trending Widget */}
          <div className="sidebar-widget">
            <div className="widget-header">
              <div className="widget-indicator"></div>
              <h3 className="widget-title">Power Rankings</h3>
            </div>
            <div className="sidebar-news-list">
              {allArticles.slice(0, 5).map((article, idx) => (
                <div className="sidebar-news-item" key={article.id}>
                  <span className="ranking-number">0{idx + 1}</span>
                  <div className="sidebar-news-img">
                    <img
                      src={article.featured_image || '/css/placeholder.jpg'}
                      alt={article.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="sidebar-news-details">
                    <h4>
                      <Link href={`/${article.slug}`}>{article.title}</Link>
                    </h4>
                    <span className="date-text">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
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
    </>
  );
}
