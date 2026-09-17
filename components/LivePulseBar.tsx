'use client';

import React, { useEffect, useState } from 'react';

export default function LivePulseBar() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const d = new Date();
    setDateStr(d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));
  }, []);

  return (
    <div className="live-pulse-bar">
      <div className="container live-pulse-container">
        <div className="live-match-ticker">
          <div className="match-chip">
            <span className="live-dot"></span>
            <span className="match-status-badge status-live">LIVE</span>
            <span>IND <strong>348/5</strong> (48.2 ov) vs AUS</span>
          </div>
          <div className="match-chip">
            <span className="match-status-badge status-stumps">STUMPS</span>
            <span>ENG <strong>210/4</strong> vs SA 284</span>
          </div>
          <div className="match-chip">
            <span className="match-status-badge status-upcoming">UPCOMING</span>
            <span>PAK vs NZ &bull; 19:30 IST</span>
          </div>
        </div>

        <div className="top-bar-right">
          <div className="server-status-indicator" title="All Services Running Operational">
            <span className="status-dot-green"></span>
            <span>SYSTEM ACTIVE</span>
          </div>
          <div id="currentDate">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}
