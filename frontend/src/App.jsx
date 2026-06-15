import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CompanyDetails from './components/CompanyDetails';
import ClientDetails from './components/ClientDetails';
import FinancialInputs from './components/FinancialInputs';
import ResultsGrid from './components/ResultsGrid';
import ShareControls from './components/ShareControls';
import ClientHistoryTable from './components/ClientHistoryTable';
import { useFormPersistence } from './hooks/useFormPersistence';
import { useApi } from './hooks/useApi';
import { buildReportText } from './utils/reportBuilder';
import { useEffect } from 'react';

const INITIAL_FORM_DATA = {
  company: 'SEA HOWLKS',
  phoneCountry: '',
  phone: '',
  email: '',
  generatedBy: '',
  client: '',
  currency: '₹',
  investment: '',
  months: '20 Months',
  profitAmount: '',
  profitPercent: '60',
  outstandingAmount: '',
  outstandingPercent: '60',
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [clientHistory, setClientHistory] = useState([]);
  const [results, setResults] = useState(null);
  const [clientReports, setClientReports] = useState([]);
  
  const { request } = useApi();

  const fetchClientReports = useCallback(async (clientName) => {
    if (!clientName || clientName.trim() === '') {
      setClientReports([]);
      return;
    }
    try {
      const data = await request(`/reports/client/${encodeURIComponent(clientName.trim())}`);
      setClientReports(data || []);
    } catch (err) {
      setClientReports([]);
    }
  }, [request]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchClientReports(formData.client), 500);
    return () => clearTimeout(timeout);
  }, [formData.client, fetchClientReports]);

  const { clearAllData, downloadDataAsJSON, addClientToHistory } = useFormPersistence(
    formData,
    setFormData,
    clientHistory,
    setClientHistory
  );

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCalculate = useCallback(async () => {
    try {
      // Add client to history if present
      if (formData.client) {
        await addClientToHistory(formData.client);
      }
      
      // Save report and get calculated results
      const computed = await request('/reports', {
        method: 'POST',
        body: JSON.stringify({
          client_name: formData.client,
          currency: formData.currency,
          investment: formData.investment,
          months: formData.months,
          profitAmount: formData.profitAmount,
          profitPercent: formData.profitPercent,
          outstandingAmount: formData.outstandingAmount,
          outstandingPercent: formData.outstandingPercent
        })
      });
      
      setResults(computed);
      fetchClientReports(formData.client);
    } catch (err) {
      console.error('Calculation failed:', err);
      alert('Failed to calculate report.');
    }
  }, [formData, addClientToHistory, request]);

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(buildReportText(formData));
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }, [formData]);

  const handleCopy = useCallback(async () => {
    const reportText = buildReportText(formData);
    try {
      await navigator.clipboard.writeText(reportText);
    } catch {
      alert('Unable to copy report.');
    }
  }, [formData]);

  const handleClear = useCallback(() => {
    clearAllData();
    setResults(null);
  }, [clearAllData]);

  return (
    <div className="container">
      <Header />
      <CompanyDetails formData={formData} onChange={handleFieldChange} />
      <ClientDetails
        formData={formData}
        onChange={handleFieldChange}
        clientHistory={clientHistory}
      />
      <ClientHistoryTable history={clientReports} currency={formData.currency} />
      <FinancialInputs
        formData={formData}
        onChange={handleFieldChange}
        onCalculate={handleCalculate}
      />
      <ResultsGrid results={results} currency={formData.currency} />
      {results && (
        <ShareControls
          onWhatsApp={handleWhatsApp}
          onCopy={handleCopy}
          onDownload={downloadDataAsJSON}
          onClear={handleClear}
        />
      )}
    </div>
  );
}
