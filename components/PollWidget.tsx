'use client';

import React, { useState } from 'react';

export default function PollWidget() {
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState('ind');

  return (
    <div className="sidebar-widget">
      <div className="widget-header">
        <div className="widget-indicator" style={{ background: '#0ea5e9' }}></div>
        <h3 className="widget-title">Fan Poll of the Day</h3>
      </div>
      <div className="poll-question">Who will claim the ICC Champions Trophy title?</div>
      {!voted ? (
        <>
          <div className="poll-options-list">
            <label className="poll-option-label">
              <input
                type="radio"
                name="cricketPoll"
                value="ind"
                checked={selected === 'ind'}
                onChange={() => setSelected('ind')}
              />
              <span>Team India (The Men in Blue)</span>
            </label>
            <label className="poll-option-label">
              <input
                type="radio"
                name="cricketPoll"
                value="aus"
                checked={selected === 'aus'}
                onChange={() => setSelected('aus')}
              />
              <span>Australia (The World Champs)</span>
            </label>
            <label className="poll-option-label">
              <input
                type="radio"
                name="cricketPoll"
                value="eng"
                checked={selected === 'eng'}
                onChange={() => setSelected('eng')}
              />
              <span>England (Defending Champions)</span>
            </label>
          </div>
          <button
            type="button"
            className="poll-submit-btn"
            onClick={() => setVoted(true)}
          >
            Submit Vote &rarr;
          </button>
        </>
      ) : (
        <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.75rem', textAlign: 'center' }}>
          ✓ Vote recorded! India leads with 68% votes.
        </div>
      )}
    </div>
  );
}
