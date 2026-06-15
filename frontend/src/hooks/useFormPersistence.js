import { useEffect, useRef, useCallback } from 'react';
import { useApi } from './useApi';

/**
 * Custom hook for persisting form data to the backend.
 */
export function useFormPersistence(formData, setFormData, clientHistory, setClientHistory) {
  const isInitialLoad = useRef(true);
  const { request } = useApi();
  const timeoutRef = useRef(null);

  // Load saved data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const companyData = await request('/company');
        const clientsData = await request('/clients');
        
        setClientHistory(clientsData.map(c => c.name));
        
        if (companyData) {
          setFormData(prev => ({
            ...prev,
            company: companyData.name || 'SEA HOWLKS',
            phoneCountry: companyData.phone_country || '',
            phone: companyData.phone || '',
            email: companyData.email || '',
            generatedBy: companyData.generated_by || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      }
    };
    
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save company data on changes with debounce
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const saveCompany = async () => {
        try {
          await request('/company', {
            method: 'PUT',
            body: JSON.stringify({
              name: formData.company,
              phone_country: formData.phoneCountry,
              phone: formData.phone,
              email: formData.email,
              generated_by: formData.generatedBy
            })
          });
        } catch (err) {
          console.error('Auto-save failed:', err);
        }
      };
      saveCompany();
    }, 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [
    formData.company,
    formData.phoneCountry,
    formData.phone,
    formData.email,
    formData.generatedBy
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save client to history
  const addClientToHistory = useCallback(async (clientName) => {
    if (!clientName || clientName.trim() === '') return;
    try {
      await request('/clients', {
        method: 'POST',
        body: JSON.stringify({ name: clientName.trim() })
      });
      // Refresh client history
      const clientsData = await request('/clients');
      setClientHistory(clientsData.map(c => c.name));
    } catch (err) {
      console.error('Failed to add client:', err);
    }
  }, [request, setClientHistory]);

  // Clear all saved data
  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all saved data?')) {
      try {
        await request('/reports', { method: 'DELETE' }); // The backend DELETE /api/reports mapped to clearData clears everything
        setClientHistory([]);
        setFormData({
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
        });
      } catch (err) {
        console.error('Failed to clear data:', err);
      }
    }
  };

  // Download data as JSON
  const downloadDataAsJSON = async () => {
    try {
      const data = await request('/reports/export');
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download data.');
      console.error(err);
    }
  };

  return { clearAllData, downloadDataAsJSON, addClientToHistory };
}
