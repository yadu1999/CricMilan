'use client';

import React, { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Guarantee the share URL points to cricmilan.in
  const cleanUrl = (url || '').replace(/cricmilan\.com/gi, 'cricmilan.in');

  const shareWA = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${cleanUrl}`)}`, '_blank');
  };

  const shareTW = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(cleanUrl)}`, '_blank');
  };

  const shareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      prompt('Copy link below:', cleanUrl);
    }
  };

  return (
    <div className="article-share-buttons">
      <button type="button" className="share-btn wa" onClick={shareWA} title="Share on WhatsApp">
        &#128241; WhatsApp
      </button>
      <button type="button" className="share-btn tw" onClick={shareTW} title="Share on X (Twitter)">
        &#120143; X / Twitter
      </button>
      <button type="button" className="share-btn fb" onClick={shareFB} title="Share on Facebook">
        &#10148; Facebook
      </button>
      <button type="button" className="share-btn copy" onClick={handleCopy} title="Copy Link">
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
    </div>
  );
}
