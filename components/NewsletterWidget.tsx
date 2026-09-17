'use client';

import React, { useState } from 'react';

export default function NewsletterWidget() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="sidebar-widget vip-club-card">
      <div className="widget-header" style={{ borderBottomColor: 'rgba(139, 92, 246, 0.3)' }}>
        <div className="widget-indicator" style={{ background: '#a855f7' }}></div>
        <h3 className="widget-title" style={{ color: '#c4b5fd' }}>CricMilan VIP Club</h3>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
        Get exclusive match insider analysis, pitch reports, and auction alerts straight to your inbox.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="vip-input-group">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-accent"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}
          >
            Join Free VIP Club
          </button>
        </div>
        {submitted && (
          <div style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 700, marginTop: '0.5rem', textAlign: 'center' }}>
            ✓ Welcome to the CricMilan VIP Club!
          </div>
        )}
      </form>
    </div>
  );
}
