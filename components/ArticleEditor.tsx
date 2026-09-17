'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/seedData';

interface Props {
  initialArticle?: Article | null;
}

export default function ArticleEditor({ initialArticle }: Props) {
  const router = useRouter();
  const isEdit = !!initialArticle;

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [category, setCategory] = useState(initialArticle?.category || 'Cricket');
  const [author, setAuthor] = useState(initialArticle?.author || 'Editorial Desk');
  const [status, setStatus] = useState(initialArticle?.status || 'published');
  const [isBreaking, setIsBreaking] = useState(initialArticle?.is_breaking === 1);
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seo_title || '');
  const [metaDesc, setMetaDesc] = useState(initialArticle?.meta_description || '');
  const [publishedAt, setPublishedAt] = useState(
    initialArticle?.published_at
      ? new Date(initialArticle.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [imagePreview, setImagePreview] = useState(initialArticle?.featured_image || '/css/placeholder.jpg');
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      setSlug(slugify(val));
    }
  };

  // HTML5 Canvas image compressor
  const handleImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const originalSizeKB = Math.round(file.size / 1024);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const compressedSizeKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        setImagePreview(compressedDataUrl);
        setCompressedImage(compressedDataUrl);
        setCompressionInfo(
          `✓ Canvas Optimized: ${originalSizeKB} KB → ${compressedSizeKB} KB (Saved ${Math.max(0, originalSizeKB - compressedSizeKB)} KB)`
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        content,
        category,
        author,
        status,
        is_breaking: isBreaking ? 1 : 0,
        featured_image: compressedImage || initialArticle?.featured_image || '',
        seo_title: seoTitle || title,
        meta_description: metaDesc,
        published_at: new Date(publishedAt).toISOString()
      };

      const url = isEdit ? `/api/admin/articles/${initialArticle.id}` : '/api/admin/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const wordsCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordsCount / 180));

  return (
    <div className="admin-body">
      <nav className="admin-navbar">
        <div className="container admin-nav-container">
          <div className="admin-brand">
            Cric<span>Milan</span>{' '}
            <span style={{ fontSize: '0.75rem', color: 'var(--cyan-pulse)', fontWeight: 700, marginLeft: '5px' }}>
              STORY COMPOSER
            </span>
          </div>
          <ul className="admin-nav-links">
            <li>
              <Link href="/admin/dashboard">&larr; Back to Dashboard</Link>
            </li>
            <li>
              <Link href="/" target="_blank" style={{ color: 'var(--cyan-pulse)' }}>
                View Site ↗
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            {isEdit ? 'Edit Article' : 'Create New Article'}
          </h2>
          <Link
            href="/admin/dashboard"
            className="btn"
            style={{ background: 'rgba(255, 255, 255, 0.08)', fontSize: '0.85rem', color: '#cbd5e1' }}
          >
            Cancel
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="editor-layout-grid">
            {/* Main Form Column */}
            <div className="editor-card">
              <div className="form-group">
                <label htmlFor="title">
                  Headline / Title <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  placeholder="Enter high-impact cricket headline..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="slug">
                  SEO Clean URL Slug <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  className="form-control"
                  placeholder="e.g. virat-kohli-historic-century"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
                  Permanent URL: cricmilan.com/
                  <strong style={{ color: 'var(--cyan-pulse)' }}>{slug || 'your-slug'}</strong>
                </small>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ marginBottom: 0 }}>
                    Article Body (HTML / Rich Text) <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{wordsCount}</span> words &bull; <span>{readTime}</span> min read
                  </div>
                </div>

                <textarea
                  id="content"
                  className="form-control"
                  style={{ minHeight: '320px', fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: '1.6' }}
                  placeholder="Compose your article body with <p>, <h2>, <blockquote> or standard text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* SERP Preview Card */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
                  🔍 Live Google Search &amp; Social Snippet Preview
                </h3>

                <div className="form-group">
                  <label htmlFor="seo_title">SEO Title (Title Tag)</label>
                  <input
                    type="text"
                    id="seo_title"
                    className="form-control"
                    placeholder="Leave blank to use Article Title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    maxLength={70}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {seoTitle.length} / 70 characters
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="meta_description">Meta Description</label>
                  <textarea
                    id="meta_description"
                    className="form-control"
                    style={{ height: '80px', resize: 'vertical' }}
                    placeholder="Brief synopsis for Google search snippets and WhatsApp link previews..."
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    maxLength={170}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {metaDesc.length} / 170 characters
                  </small>
                </div>

                <div className="serp-preview-box">
                  <div className="serp-url">
                    <span>cricmilan.com &rsaquo; {slug || 'slug'}</span>
                  </div>
                  <div className="serp-title">{seoTitle || title || 'Your Article Headline Will Appear Here - CricMilan'}</div>
                  <div className="serp-desc">
                    {metaDesc || 'Provide a meta description above to see exactly how Google Search and WhatsApp link previews will display your story to readers worldwide.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Options Column */}
            <div className="editor-card">
              <div className="form-group">
                <label htmlFor="status">Publishing Status</label>
                <select
                  id="status"
                  className="form-control"
                  style={{ fontWeight: 700 }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                >
                  <option value="published">Live (Published)</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Cricket">Cricket</option>
                  <option value="Breaking News">Breaking News</option>
                  <option value="Stories">Stories</option>
                  <option value="India">India</option>
                  <option value="World">World</option>
                  <option value="Trending">Trending</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="author">Author Desk</label>
                <input
                  type="text"
                  id="author"
                  className="form-control"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="published_at">Publication Date</label>
                <input
                  type="datetime-local"
                  id="published_at"
                  className="form-control"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', textTransform: 'none', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    id="is_breaking"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                  />
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>🔥 Feature in Breaking News Ticker</span>
                </label>
              </div>

              {/* Featured Image Section with Canvas compression */}
              <div className="form-group" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <label>Featured Story Image</label>

                <div
                  className="image-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>📷</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                    Click to Select or Drop Image
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Auto-optimized in browser via HTML5 Canvas
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                />

                <div className="img-preview-box">
                  <img src={imagePreview} alt="Preview" />
                </div>
                {compressionInfo && (
                  <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.4rem', fontWeight: 700 }}>
                    {compressionInfo}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-accent btn-block"
                style={{ marginTop: '1.5rem', padding: '0.85rem', fontSize: '1rem', width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Story' : 'Publish Story'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
