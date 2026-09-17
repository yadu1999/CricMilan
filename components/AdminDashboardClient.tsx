'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/seedData';

interface Props {
  initialArticles: Article[];
  stats: {
    total: number;
    published: number;
    draft: number;
    breaking: number;
  };
  adminUsername: string;
}

export default function AdminDashboardClient({ initialArticles, stats, adminUsername }: Props) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const filteredArticles = articles.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete article');
      }
    } catch (e) {
      alert('Error deleting article');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg(null);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPwMsg({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-body">
      {/* Admin Navigation */}
      <nav className="admin-navbar">
        <div className="container admin-nav-container">
          <div className="admin-brand">
            Cric<span>Milan</span>{' '}
            <span style={{ fontSize: '0.75rem', color: 'var(--cyan-pulse)', fontWeight: 700, marginLeft: '5px' }}>
              COMMAND CENTER
            </span>
          </div>
          <ul className="admin-nav-links">
            <li>
              <Link href="/" target="_blank" style={{ color: 'var(--cyan-pulse)' }}>
                View Live Site ↗
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.08)' }}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/editor" className="btn btn-accent" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                + New Article
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        {/* Diagnostics Banner */}
        <div className="diagnostics-panel">
          <div className="diag-item">
            <span
              className="status-dot-green"
              style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}
            ></span>
            <strong>System Status:</strong> Operational
          </div>
          <div className="diag-item">
            <strong>Database:</strong> SQLite Connected
          </div>
          <div className="diag-item">
            <strong>Logged In:</strong> {adminUsername}
          </div>
          <div className="diag-item">
            <strong>Framework:</strong> Next.js App Router
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon total">&#128240;</div>
            <div className="kpi-content">
              <span className="kpi-title">Total Articles</span>
              <span className="kpi-value">{articles.length}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon published">&#9989;</div>
            <div className="kpi-content">
              <span className="kpi-title">Published (Live)</span>
              <span className="kpi-value">{articles.filter((a) => a.status === 'published').length}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon draft">&#9997;</div>
            <div className="kpi-content">
              <span className="kpi-title">Drafts</span>
              <span className="kpi-value">{articles.filter((a) => a.status === 'draft').length}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon breaking">&#128293;</div>
            <div className="kpi-content">
              <span className="kpi-title">Breaking Stories</span>
              <span className="kpi-value">{articles.filter((a) => a.is_breaking === 1).length}</span>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="admin-table-card">
          <div className="admin-table-toolbar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Editorial Inventory ({filteredArticles.length})
            </div>
            <div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
                placeholder="Search by title, category, author..."
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Story Headline &amp; Slug</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Published</th>
                  <th>Breaking</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr className="table-row-item" key={article.id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>#{article.id}</td>
                      <td style={{ maxWidth: '380px' }}>
                        <Link
                          href={`/${article.slug}`}
                          target="_blank"
                          style={{ fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.2rem' }}
                        >
                          {article.title}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cyan-pulse)' }}>/{article.slug}</div>
                      </td>
                      <td>
                        <span
                          className={`category-badge cat-${article.category.toLowerCase().replace(/\s+/g, '-')}`}
                          style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}
                        >
                          {article.category}
                        </span>
                      </td>
                      <td style={{ color: '#cbd5e1', fontWeight: 600 }}>{article.author}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        {article.is_breaking === 1 ? (
                          <span
                            style={{
                              color: 'var(--accent-red)',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <span
                              className="status-dot-green"
                              style={{ background: 'var(--accent-red)', boxShadow: '0 0 6px var(--accent-red)' }}
                            ></span>{' '}
                            ON
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>OFF</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${article.status}`}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: article.status === 'published' ? '#10b981' : '#f59e0b'
                            }}
                          ></span>
                          {article.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-links">
                          <Link href={`/admin/editor/${article.id}`} className="edit">
                            Edit
                          </Link>
                          <Link
                            href={`/${article.slug}`}
                            target="_blank"
                            className="edit"
                            style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)' }}
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className="delete"
                            onClick={() => handleDelete(article.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                      No articles found. Click &ldquo;+ New Article&rdquo; to compose.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Password Change */}
        <div
          style={{
            maxWidth: '480px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.5rem'
            }}
          >
            Security &bull; Change Admin Password
          </h3>

          {pwMsg && (
            <div className={`alert alert-${pwMsg.type === 'success' ? 'success' : 'danger'}`}>
              {pwMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password (Min 6 characters)</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              style={{ marginTop: '0.5rem' }}
              disabled={pwLoading}
            >
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
