"use client";

import { usePricing } from '@/hooks/use-pricing';
import { COUNTRY_DATA, type CountryCode } from '@/lib/pricing/countryPricing';

interface CountrySelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function CountrySelector({ className, showLabel = false }: CountrySelectorProps) {
  const { country, changeCountry, supportedCountries, loading } = usePricing();
  
  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg h-10 w-32 ${className || ''}`} />
    );
  }

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Pays / Country
        </label>
      )}
      <select 
        value={country}
        onChange={(e) => changeCountry(e.target.value as CountryCode)}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zencall-coral-100 focus:border-zencall-coral-200 transition-all"
      >
        {supportedCountries.map((code) => (
          <option key={code} value={code}>
            {COUNTRY_DATA[code].flag} {COUNTRY_DATA[code].name}
          </option>
        ))}
      </select>
    </div>
  );
}
