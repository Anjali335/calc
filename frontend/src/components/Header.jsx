import React from 'react';

export default function Header() {
  return (
    <div className="header">
      <div className="header-glow" />
      <h1>SEA HOWLKS</h1>
      <p className="header-subtitle">Professional Financial Dashboard</p>
      <div className="save-status">
        <span className="save-indicator">
          <span className="save-dot" />
          ✓ Auto-saving enabled
        </span>
      </div>
    </div>
  );
}
