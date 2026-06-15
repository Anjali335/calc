import React from 'react';

export default function ClientDetails({ formData, onChange, clientHistory }) {
  const handleClientSelect = (e) => {
    if (e.target.value) {
      onChange('client', e.target.value);
      // Reset the select back to placeholder
      e.target.value = '';
    }
  };

  return (
    <div className="card card-animate">
      <h2>
        <span className="card-icon">👤</span>
        Client Details
      </h2>

      <div className="row">
        <label htmlFor="client">Client Name</label>
        <div className="client-input-group">
          <input
            type="text"
            id="client"
            value={formData.client}
            maxLength={60}
            placeholder="Up to 60 characters"
            onChange={(e) => onChange('client', e.target.value)}
          />
          <select
            id="clientHistory"
            defaultValue=""
            onChange={handleClientSelect}
          >
            <option value="">Previous Clients</option>
            {clientHistory.map((name, index) => (
              <option key={`${name}-${index}`} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
