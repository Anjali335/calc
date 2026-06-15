import React from 'react';
import { formatNumber } from '../utils/formatNumber';

export default function ClientHistoryTable({ history, currency }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="card card-animate">
      <h2>
        <span className="card-icon">📜</span>
        Client History
      </h2>
      <div className="table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Investment</th>
              <th>Maturity</th>
              <th>Profit Value</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {history.map((report) => {
              const reportCurrency = report.currency || currency;
              return (
                <tr key={report.id}>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                  <td>{reportCurrency}{formatNumber(report.investment)}</td>
                  <td>{reportCurrency}{formatNumber(report.maturity_amount)}</td>
                  <td>{reportCurrency}{formatNumber(report.profit_value)}</td>
                  <td>{reportCurrency}{formatNumber(report.total_value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
