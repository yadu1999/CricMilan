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

  // Dynamic Categories
  const [categoriesList, setCategoriesList] = useState<string[]>([
    'Cricket', 'Breaking News', 'Stories', 'India', 'World', 'Trending'
  ]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Primary image
  const [imagePreview, setImagePreview] = useState(initialArticle?.featured_image || '/css/placeholder.jpg');
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  // Additional images (Photo 2, Photo 3, etc.)
  const parsedAdditional: string[] = (() => {
    try {
      if (initialArticle?.additional_images) {
        const arr = JSON.parse(initialArticle.additional_images);
        return Array.isArray(arr) ? arr : [];
      }
    } catch (e) {}
    return [];
  })();
  const [additionalImages, setAdditionalImages] = useState<string[]>(parsedAdditional);
  const [isProcessingAdditional, setIsProcessingAdditional] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(prev => Array.from(new Set([...prev, ...data])));
        }
      })
      .catch(() => {});
  }, []);

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

  // Generic HTML5 Canvas image compressor
  const compressFile = (file: File): Promise<{ dataUrl: string; originalKB: number; compressedKB: number }> => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        return resolve({ dataUrl: '', originalKB: 0, compressedKB: 0 });
      }
      const originalKB = Math.round(file.size / 1024);
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
          if (!ctx) return resolve({ dataUrl: '', originalKB, compressedKB: originalKB });

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const compressedKB = Math.round((dataUrl.length * 3) / 4 / 1024);
          resolve({ dataUrl, originalKB, compressedKB });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Primary image handler
  const handleImageFile = async (file: File) => {
    const res = await compressFile(file);
    if (res.dataUrl) {
      setImagePreview(res.dataUrl);
      setCompressedImage(res.dataUrl);
      setCompressionInfo(
        `✓ Main Canvas Optimized: ${res.originalKB} KB → ${res.compressedKB} KB`
      );
    }
  };

  // Additional images handler (multi-file support)
  const handleAdditionalFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingAdditional(true);
    const newItems: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const res = await compressFile(files[i]);
      if (res.dataUrl) {
        newItems.push(res.dataUrl);
      }
    }

    setAdditionalImages(prev => [...prev, ...newItems]);
    setIsProcessingAdditional(false);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed) {
      setCategoriesList(prev => Array.from(new Set([...prev, trimmed])));
      setCategory(trimmed);
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    }
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
        additional_images: JSON.stringify(additionalImages),
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
            <span style={{ fontSize: '1.4rem' }}>🏏</span>
            <span style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              Cric<span style={{ color: 'var(--accent-red)' }}>Milan</span> CMS
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
                  Clean URL Slug <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  className="form-control"
                  placeholder="virat-kohli-champions-trophy-record"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
                  Permanent URL: cricmilan.in/
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

              {/* In-Article Photos Helper Box */}
              {additionalImages.length > 0 && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                    📸 In-Article Photos ({additionalImages.length} attached)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                    These photos will automatically display between paragraphs in the article reader view. You can also insert them manually into the text:
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {additionalImages.map((img, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                        <img src={img} alt={`Photo ${idx + 2}`} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                        <span style={{ fontSize: '0.75rem', color: '#e2e8f0' }}>Photo #{idx + 2}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setContent(prev => `${prev}\n\n<p><img src="${img}" alt="Article Photo ${idx + 2}" style="max-width:100%; border-radius:8px; margin:1.5rem 0;" /></p>\n\n`);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--cyan-pulse)', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                        >
                          + Insert
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    <span>cricmilan.in &rsaquo; {slug || 'slug'}</span>
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

              {/* Dynamic Category Selector */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label htmlFor="category" style={{ marginBottom: 0 }}>Category <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                    style={{ background: 'none', border: 'none', color: 'var(--cyan-pulse)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {showNewCategoryInput ? '✕ Cancel' : '+ Add New Category'}
                  </button>
                </div>

                {showNewCategoryInput && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. IPL, T20 World Cup, WTC"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-accent"
                      style={{ padding: '0 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      onClick={handleAddNewCategory}
                    >
                      Add
                    </button>
                  </div>
                )}

                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setShowNewCategoryInput(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  required
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__add_new__">+ Add New Category...</option>
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

              {/* 1. Main Featured Photo (Image 1) */}
              <div className="form-group" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <label style={{ fontWeight: 800 }}>Main Lead Photo (Image 1 - Header)</label>

                <div
                  className="image-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>📷</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                    Select Main Lead Photo
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
                  <img src={imagePreview} alt="Lead Preview" />
                </div>
                {compressionInfo && (
                  <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.4rem', fontWeight: 700 }}>
                    {compressionInfo}
                  </div>
                )}
              </div>

              {/* 2. Additional Photos (Image 2, 3, etc. for in-article view) */}
              <div className="form-group" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 800, marginBottom: 0 }}>
                    Additional Photos (Image 2, 3+)
                  </label>
                  <button
                    type="button"
                    onClick={() => additionalFilesRef.current?.click()}
                    className="btn btn-accent"
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                  >
                    + Add Photo(s)
                  </button>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Add 2 or more photos to display between article paragraphs automatically.
                </div>

                <input
                  type="file"
                  ref={additionalFilesRef}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleAdditionalFiles(e.target.files);
                    e.target.value = '';
                  }}
                />

                {isProcessingAdditional && (
                  <div style={{ color: 'var(--cyan-pulse)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                    ⏳ Compressing photos...
                  </div>
                )}

                {additionalImages.length === 0 ? (
                  <div
                    onClick={() => additionalFilesRef.current?.click()}
                    style={{
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem' }}>🖼️</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Click to add 2nd, 3rd photo...
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {additionalImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '0.5rem'
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Photo ${index + 2}`}
                          style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                            Photo #{index + 2}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            In-Article Paragraph Break
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                          title="Remove photo"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))}
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
