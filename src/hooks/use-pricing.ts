"use client";

import { useState, useEffect } from 'react';
import { COUNTRY_PRICING, SUPPORTED_COUNTRIES, DEFAULT_COUNTRY, type CountryCode } from '@/lib/pricing/countryPricing';

interface PricingData {
  country: CountryCode;
  pricing: typeof COUNTRY_PRICING[CountryCode];
  supported: CountryCode[];
  detectedFrom?: string;
}

export function usePricing() {
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [loading, setLoading] = useState(true);
  const [detectedFrom, setDetectedFrom] = useState<string>('default');

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('/api/geo');
        if (!res.ok) throw new Error('Geo detection failed');
        
        const data: PricingData = await res.json();
        setCountry(data.country);
        setDetectedFrom(data.detectedFrom || 'default');
      } catch (error) {
        console.error('Country detection error:', error);
        // Fallback sur localStorage
        const saved = localStorage.getItem('zencall_country');
        if (saved && SUPPORTED_COUNTRIES.includes(saved as CountryCode)) {
          setCountry(saved as CountryCode);
          setDetectedFrom('localstorage');
        }
      } finally {
        setLoading(false);
      }
    }
    detectCountry();
  }, []);

  const changeCountry = async (newCountry: CountryCode) => {
    setCountry(newCountry);
    localStorage.setItem('zencall_country', newCountry);
    
    // Mettre à jour le cookie via l'API
    try {
      await fetch('/api/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: newCountry }),
      });
    } catch (error) {
      console.error('Failed to update country cookie:', error);
    }
  };

  return {
    country,
    pricing: COUNTRY_PRICING[country],
    changeCountry,
    loading,
    supportedCountries: SUPPORTED_COUNTRIES,
    detectedFrom,
  };
}
