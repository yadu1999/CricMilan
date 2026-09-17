'use client';

import React, { useState } from 'react';

interface ReactionsProps {
  articleId: number;
  initialReactions: Record<string, number>;
}

export default function Reactions({ articleId, initialReactions }: ReactionsProps) {
  const [counts, setCounts] = useState(initialReactions);
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type: string) => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    setCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));
    setUserReacted(type);
    setToast(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: type })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reactions) {
          setCounts(data.reactions);
        }
      }
    } catch (e) {
      console.warn('Reaction update error:', e);
    } finally {
      setLoading(false);
      setTimeout(() => setToast(false), 4000);
    }
  };

  return (
    <div className="article-reactions-container">
      <h3 className="reactions-title">&#128079; How did you feel about this story?</h3>
      <div className="reactions-grid">
        <button
          className={`reaction-btn ${userReacted === 'fire' ? 'active' : ''}`}
          onClick={() => handleReact('fire')}
          disabled={loading}
        >
          <span>&#128293; Thrilling</span>
          <span className="reaction-count">{counts.fire ?? 14}</span>
        </button>

        <button
          className={`reaction-btn ${userReacted === 'cricket' ? 'active' : ''}`}
          onClick={() => handleReact('cricket')}
          disabled={loading}
        >
          <span>&#127951; Masterclass</span>
          <span className="reaction-count">{counts.cricket ?? 28}</span>
        </button>

        <button
          className={`reaction-btn ${userReacted === 'clap' ? 'active' : ''}`}
          onClick={() => handleReact('clap')}
          disabled={loading}
        >
          <span>&#128079; Historic</span>
          <span className="reaction-count">{counts.clap ?? 19}</span>
        </button>

        <button
          className={`reaction-btn ${userReacted === 'heart' ? 'active' : ''}`}
          onClick={() => handleReact('heart')}
          disabled={loading}
        >
          <span>&#10084;&#65039; Loved It</span>
          <span className="reaction-count">{counts.heart ?? 32}</span>
        </button>
      </div>

      {toast && (
        <div style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.75rem', textAlign: 'center' }}>
          ✓ Thank you for your feedback!
        </div>
      )}
    </div>
  );
}
