import React from 'react';

const CURRENCIES = [
  { value: '₹', label: 'INR' },
  { value: '$', label: 'USD' },
  { value: '€', label: 'EUR' },
  { value: '£', label: 'GBP' },
];

export default function FinancialInputs({ formData, onChange, onCalculate }) {
  const currencySymbol = formData.currency || '₹';

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div className="card card-animate">
      <h2>
        <span className="card-icon">💰</span>
        Financial Inputs
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => onChange('currency', e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <label htmlFor="investment">Investment Amount</label>
          <div className="input-group">
            <span className="currency-symbol">{currencySymbol}</span>
            <input
              type="number"
              id="investment"
              value={formData.investment}
              placeholder="0"
              onChange={(e) => onChange('investment', e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <label htmlFor="months">Maturity Period</label>
          <input
            type="text"
            id="months"
            value={formData.months}
            onChange={(e) => onChange('months', e.target.value)}
          />
        </div>

        <div className="row">
          <label htmlFor="profitAmount">Profit Withdrawal</label>
          <div className="input-group">
            <span className="currency-symbol">{currencySymbol}</span>
            <input
              type="number"
              id="profitAmount"
              value={formData.profitAmount}
              placeholder="0"
              onChange={(e) => onChange('profitAmount', e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <label htmlFor="profitPercent">Profit %</label>
          <div className="input-group">
            <span>%</span>
            <input
              type="number"
              id="profitPercent"
              value={formData.profitPercent}
              onChange={(e) => onChange('profitPercent', e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <label htmlFor="outstandingAmount">Outstanding Withdrawal</label>
          <div className="input-group">
            <span className="currency-symbol">{currencySymbol}</span>
            <input
              type="number"
              id="outstandingAmount"
              value={formData.outstandingAmount}
              placeholder="0"
              onChange={(e) => onChange('outstandingAmount', e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <label htmlFor="outstandingPercent">Outstanding %</label>
          <div className="input-group">
            <span>%</span>
            <input
              type="number"
              id="outstandingPercent"
              value={formData.outstandingPercent}
              onChange={(e) => onChange('outstandingPercent', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-calculate">
          <span className="btn-icon">📊</span>
          Calculate Report
        </button>
      </form>
    </div>
  );
}
