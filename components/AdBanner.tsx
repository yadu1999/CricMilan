import React from 'react';

interface AdBannerProps {
  type: 'header' | 'sidebar' | 'content';
}

export default function AdBanner({ type }: AdBannerProps) {
  if (type === 'header') {
    return (
      <div
        className="ad-space ad-header"
        style={{
          backgroundColor: '#0f172a',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          margin: '1.5rem auto',
          padding: '5px',
          textAlign: 'center',
          maxWidth: '728px',
          height: '90px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            color: '#64748b',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          ADVERTISEMENT (728x90)
        </span>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div
        className="ad-space ad-sidebar"
        style={{
          backgroundColor: '#0f172a',
          border: '1px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          margin: '1.5rem 0',
          padding: '5px',
          textAlign: 'center',
          width: '100%',
          maxWidth: '300px',
          height: '250px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            color: '#64748b',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          ADVERTISEMENT (300x250)
        </span>
      </div>
    );
  }

  return (
    <div
      className="ad-space ad-content"
      style={{
        backgroundColor: '#0f172a',
        border: '1px dashed rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        margin: '2rem auto',
        padding: '5px',
        textAlign: 'center',
        maxWidth: '728px',
        height: '90px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <span
        style={{
          fontSize: '0.65rem',
          color: '#64748b',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}
      >
        SPONSORED CONTENT (728x90)
      </span>
    </div>
  );
}
