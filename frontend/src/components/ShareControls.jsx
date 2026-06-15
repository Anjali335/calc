import React, { useState } from 'react';

export default function ShareControls({ onWhatsApp, onCopy, onDownload, onClear }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-controls">
      <button type="button" className="btn-whatsapp" onClick={onWhatsApp}>
        <span className="btn-icon">💬</span>
        WhatsApp
      </button>

      <button type="button" className="btn-copy" onClick={handleCopy}>
        <span className="btn-icon">{copied ? '✅' : '📋'}</span>
        {copied ? 'Copied!' : 'Copy Report'}
      </button>

      <button type="button" className="btn-secondary" onClick={onDownload}>
        <span className="btn-icon">💾</span>
        Download Data
      </button>

      <button type="button" className="btn-danger" onClick={onClear}>
        <span className="btn-icon">🗑️</span>
        Clear Saved Data
      </button>
    </div>
  );
}
