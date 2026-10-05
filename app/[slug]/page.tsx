import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import ShareButtons from '@/components/ShareButtons';
import Reactions from './Reactions';
import { STATIC_PAGES } from '@/lib/staticPages';
import {
  getArticleBySlug,
  getArticlesByCategory,
  getArticleReactions,
  getPublishedArticles
} from '@/lib/db';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function interleaveContentWithImages(htmlContent: string, additionalImagesJson?: string, articleTitle?: string): string {
  if (!additionalImagesJson) return htmlContent;
  let images: string[] = [];
  try {
    const parsed = JSON.parse(additionalImagesJson);
    if (Array.isArray(parsed)) {
      images = parsed.filter(Boolean);
    }
  } catch (e) {
    return htmlContent;
  }

  if (images.length === 0) return htmlContent;

  // Interleave inside <p> paragraphs
  if (htmlContent.includes('</p>')) {
    const parts = htmlContent.split('</p>');
    const totalParts = parts.length - 1;
    if (totalParts <= 0) return htmlContent;

    const interval = Math.max(1, Math.floor(totalParts / (images.length + 1)));
    let result = '';
    let imageIndex = 0;

    for (let i = 0; i < totalParts; i++) {
      result += parts[i] + '</p>';
      const shouldInsert = (i + 1) % interval === 0 || (i === totalParts - 1 && imageIndex < images.length);
      if (shouldInsert && imageIndex < images.length) {
        const img = images[imageIndex];
        result += `
          <figure class="article-body-photo" style="margin: 2rem 0; text-align: center;">
            <img src="${img}" alt="${articleTitle || 'Article photo'} - Photo ${imageIndex + 2}" style="width: 100%; max-height: 520px; object-fit: cover; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);" loading="lazy" />
          </figure>
        `;
        imageIndex++;
      }
    }

    if (parts[parts.length - 1]) {
      result += parts[parts.length - 1];
    }

    while (imageIndex < images.length) {
      const img = images[imageIndex];
      result += `
        <figure class="article-body-photo" style="margin: 2rem 0; text-align: center;">
          <img src="${img}" alt="${articleTitle || 'Article photo'} - Photo ${imageIndex + 2}" style="width: 100%; max-height: 520px; object-fit: cover; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);" loading="lazy" />
        </figure>
      `;
      imageIndex++;
    }

    return result;
  }

  // Interleave plain text paragraphs
  const paragraphs = htmlContent.split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length > 1) {
    const interval = Math.max(1, Math.floor(paragraphs.length / (images.length + 1)));
    let result = '';
    let imageIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      result += `<p>${paragraphs[i]}</p>`;
      if ((i + 1) % interval === 0 && imageIndex < images.length) {
        const img = images[imageIndex];
        result += `
          <figure class="article-body-photo" style="margin: 2rem 0; text-align: center;">
            <img src="${img}" alt="${articleTitle || 'Article photo'} - Photo ${imageIndex + 2}" style="width: 100%; max-height: 520px; object-fit: cover; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);" loading="lazy" />
          </figure>
        `;
        imageIndex++;
      }
    }
    while (imageIndex < images.length) {
      const img = images[imageIndex];
      result += `
        <figure class="article-body-photo" style="margin: 2rem 0; text-align: center;">
          <img src="${img}" alt="${articleTitle || 'Article photo'} - Photo ${imageIndex + 2}" style="width: 100%; max-height: 520px; object-fit: cover; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);" loading="lazy" />
        </figure>
      `;
      imageIndex++;
    }
    return result;
  }

  // Fallback sentence splitting
  const sentences = htmlContent.split(/(?<=[.?!])\s+/);
  if (sentences.length >= 3 && images.length > 0) {
    const mid = Math.floor(sentences.length / 2);
    const firstHalf = sentences.slice(0, mid).join(' ');
    const secondHalf = sentences.slice(mid).join(' ');
    return `<p>${firstHalf}</p>
      <figure class="article-body-photo" style="margin: 2rem 0; text-align: center;">
        <img src="${images[0]}" alt="${articleTitle || 'Article photo'}" style="width: 100%; max-height: 520px; object-fit: cover; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);" loading="lazy" />
      </figure>
      <p>${secondHalf}</p>`;
  }

  return `${htmlContent}<figure class="article-body-photo" style="margin: 2rem 0; text-align: center;"><img src="${images[0]}" alt="${articleTitle || 'Article photo'}" style="width: 100%; max-height: 520px; object-fit: cover; border-radius: 10px;" loading="lazy" /></figure>`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (STATIC_PAGES[slug]) {
    const p = STATIC_PAGES[slug];
    return {
      title: `${p.title} - CricMilan`,
      description: p.metaDescription
    };
  }

  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Page Not Found - CricMilan'
    };
  }

  const title = article.seo_title || `${article.title} - CricMilan`;
  const description = article.meta_description || 'Read the full article and live analysis on CricMilan.in.';
  const image = article.featured_image || '/css/logo-og.jpg';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cricmilan.in';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${article.slug}`,
      siteName: 'CricMilan',
      images: [{ url: image, alt: article.title }],
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles(20);
  const staticSlugs = Object.keys(STATIC_PAGES).map((slug) => ({ slug }));
  const articleSlugs = articles.map((a) => ({ slug: a.slug }));
  return [...staticSlugs, ...articleSlugs];
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  if (STATIC_PAGES[slug]) {
    const staticPage = STATIC_PAGES[slug];
    const sidebarArticles = await getPublishedArticles(5);

    return (
      <div className="main-layout">
        <div className="main-content">
          <article className="article-container">
            <header className="article-detail-header">
              <div className="article-breadcrumbs">
                <Link href="/">Home</Link> &raquo; <span>{staticPage.title}</span>
              </div>
              <h1 className="article-main-title">{staticPage.title}</h1>
            </header>

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: staticPage.content }}
            />
          </article>
        </div>

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

  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  const [reactions, relatedArticles, allArticles] = await Promise.all([
    getArticleReactions(article.id),
    getArticlesByCategory(article.category, 4),
    getPublishedArticles(5)
  ]);

  const categoryRelated = relatedArticles.filter((a) => a.id !== article.id);
  const filteredRelated = (categoryRelated.length > 0 ? categoryRelated : allArticles.filter((a) => a.id !== article.id)).slice(0, 3);
  const wordsCount = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.max(2, Math.ceil(wordsCount / 180));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cricmilan.in';
  const fullUrl = `${baseUrl}/${article.slug}`;

  // JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    headline: article.seo_title || article.title,
    image: [article.featured_image ? (article.featured_image.startsWith('http') ? article.featured_image : `${baseUrl}${article.featured_image}`) : `${baseUrl}/css/logo-og.jpg`],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'CricMilan',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/css/logo-og.jpg`
      }
    },
    description: article.meta_description
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="main-layout">
        {/* Left Column (Article Detail) */}
        <div className="main-content">
          <article className="article-container">
            <header className="article-detail-header">
              <div className="article-breadcrumbs">
                <Link href="/">Home</Link> &raquo;{' '}
                <Link href={`/category/${article.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {article.category}
                </Link>{' '}
                &raquo;{' '}
                <span>
                  {article.title.length > 40 ? `${article.title.substring(0, 40)}...` : article.title}
                </span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span className={`category-badge cat-${article.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {article.category}
                </span>
                {article.is_breaking === 1 && (
                  <span className="category-badge cat-breaking-news" style={{ marginLeft: '0.5rem' }}>
                    <span className="flame-icon">&#128293;</span> Breaking
                  </span>
                )}
              </div>

              <h1 className="article-main-title">{article.title}</h1>
            </header>

            {article.featured_image && (
              <div className="article-main-image">
                <img src={article.featured_image} alt={article.title} />
              </div>
            )}

            {/* Match Highlights / Key Takeaways Callout */}
            <div className="takeaways-callout">
              <h4>&#127951; Match Summary &amp; Key Highlights</h4>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: 0 }}>
                {article.meta_description || 'Get comprehensive ball-by-ball analysis, expert reactions, and tactical breakdown on CricMilan.in.'}
              </p>
            </div>

            {/* Article Body Content with Interleaved In-Article Photos */}
            <div
              className="article-body"
              dangerouslySetInnerHTML={{
                __html: interleaveContentWithImages(article.content, article.additional_images, article.title)
              }}
            />

            {/* Author Credits & Social Sharing (Moved to bottom of article) */}
            <div className="article-author-bar article-author-bar-bottom">
              <div className="article-author-info">
                <div className="author-large-avatar">
                  {article.author ? article.author.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="author-meta-lines">
                  <span className="author-name">By {article.author}</span>
                  <span className="published-date-line">
                    Published{' '}
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}{' '}
                    &bull; {readTime} min read
                  </span>
                </div>
              </div>

              <ShareButtons title={article.title} url={fullUrl} />
            </div>

            {/* Interactive Article Reactions Bar */}
            <Reactions articleId={article.id} initialReactions={reactions} />

            {/* Ad Placement below article content */}
            <AdBanner type="content" />

            {/* Related Stories Grid */}
            {filteredRelated.length > 0 && (
              <div className="related-stories-section">
                <div className="section-header-bar">
                  <div className="section-title-wrap">
                    <div className="section-indicator"></div>
                    <h3 className="section-title" style={{ fontSize: '1.25rem' }}>More Like This</h3>
                  </div>
                </div>
                <div className="news-grid-3">
                  {filteredRelated.map((rel) => (
                    <article className="article-card" key={rel.id}>
                      <div className="card-img">
                        <Link href={`/${rel.slug}`}>
                          <img
                            src={rel.featured_image || '/css/placeholder.jpg'}
                            alt={rel.title}
                            loading="lazy"
                          />
                        </Link>
                        <span className={`category-badge cat-${rel.category.toLowerCase().replace(/\s+/g, '-')}`}>
                          {rel.category}
                        </span>
                      </div>
                      <div className="card-content">
                        <h3>
                          <Link href={`/${rel.slug}`}>{rel.title}</Link>
                        </h3>
                        <span className="date-text">
                          {new Date(rel.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginTop: '2rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center'
              }}
            >
              <div className="author-large-avatar" style={{ width: '60px', height: '60px', fontSize: '1.4rem' }}>
                {article.author ? article.author.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  {article.author}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                  Sports Journalist &amp; Senior Cricket Columnist at CricMilan. Dedicated to bringing ball-by-ball analysis, player statistics, and unfiltered locker-room stories.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column (Sidebar) */}
        <aside className="sidebar">
          <AdBanner type="sidebar" />

          {/* Top Stories Widget */}
          <div className="sidebar-widget">
            <div className="widget-header">
              <div className="widget-indicator"></div>
              <h3 className="widget-title">Top Stories</h3>
            </div>
            <div className="sidebar-news-list">
              {allArticles.map((item, idx) => (
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
    </>
  );
}
