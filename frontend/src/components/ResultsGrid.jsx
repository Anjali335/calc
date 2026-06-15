import React from 'react';
import { formatNumber } from '../utils/formatNumber';

const RESULT_ITEMS = [
  { key: 'maturityAmount', label: 'Maturity Amount', icon: '🎯' },
  { key: 'profitValue', label: 'Profit Value', icon: '📈' },
  { key: 'outstandingValue', label: 'Outstanding Value', icon: '📋' },
  { key: 'totalValue', label: 'Total Value', icon: '💎' },
  { key: 'leftoverValue', label: 'Leftover Value', icon: '🏦' },
  { key: 'transferValue', label: 'Transfer Value', icon: '💸' },
  { key: 'monthlyProfit', label: 'Monthly Profit', icon: '📅' },
];

export default function ResultsGrid({ results, currency }) {
  if (!results) return null;

  return (
    <div className="results-grid">
      {RESULT_ITEMS.map((item, index) => (
        <div
          key={item.key}
          className="result-box"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className="result-icon">{item.icon}</div>
          <div className="result-title">{item.label}</div>
          <div className="result-value">
            {currency}
            {formatNumber(results[item.key])}
          </div>
        </div>
      ))}
    </div>
  );
}
