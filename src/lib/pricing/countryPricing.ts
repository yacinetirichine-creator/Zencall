export const COUNTRY_PRICING = {
  FR: {
    currency: 'EUR',
    symbol: '€',
    locale: 'fr-FR',
    plans: {
      starter: { price: 29, minutes: 100, extraMinute: 0.09 },
      pro: { price: 99, minutes: 500, extraMinute: 0.08 },
      business: { price: 299, minutes: 2000, extraMinute: 0.07 },
      agency: { price: 599, minutes: 5000, extraMinute: 0.06 },
    },
    vat: 20, // TVA française
  },
  
  ES: {
    currency: 'EUR',
    symbol: '€',
    locale: 'es-ES',
    plans: {
      starter: { price: 25, minutes: 100, extraMinute: 0.08 }, // -15% vs FR
      pro: { price: 89, minutes: 500, extraMinute: 0.07 },
      business: { price: 269, minutes: 2000, extraMinute: 0.06 },
      agency: { price: 549, minutes: 5000, extraMinute: 0.05 },
    },
    vat: 21, // IVA espagnole
  },
  
  DE: {
    currency: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    plans: {
      starter: { price: 35, minutes: 100, extraMinute: 0.11 }, // +20% vs FR (pouvoir d'achat)
      pro: { price: 119, minutes: 500, extraMinute: 0.10 },
      business: { price: 349, minutes: 2000, extraMinute: 0.09 },
      agency: { price: 699, minutes: 5000, extraMinute: 0.08 },
    },
    vat: 19, // MwSt allemande
  },
  
  MA: {
    currency: 'MAD',
    symbol: 'DH',
    locale: 'ar-MA',
    plans: {
      starter: { price: 290, minutes: 50, extraMinute: 2.0 }, // ~€27, moins de minutes (coût télécom élevé)
      pro: { price: 990, minutes: 200, extraMinute: 1.8 },
      business: { price: 2900, minutes: 800, extraMinute: 1.5 },
      agency: { price: 5900, minutes: 2000, extraMinute: 1.2 },
    },
    vat: 20, // TVA marocaine
  },
  
  NL: {
    currency: 'EUR',
    symbol: '€',
    locale: 'nl-NL',
    plans: {
      starter: { price: 32, minutes: 100, extraMinute: 0.10 },
      pro: { price: 109, minutes: 500, extraMinute: 0.09 },
      business: { price: 329, minutes: 2000, extraMinute: 0.08 },
      agency: { price: 649, minutes: 5000, extraMinute: 0.07 },
    },
    vat: 21, // BTW néerlandaise
  },
} as const;

export type CountryCode = keyof typeof COUNTRY_PRICING;
export type PlanTier = 'starter' | 'pro' | 'business' | 'agency';

export const COUNTRY_DATA = {
  FR: { flag: '🇫🇷', name: 'France', lang: 'Français' },
  ES: { flag: '🇪🇸', name: 'España', lang: 'Español' },
  DE: { flag: '🇩🇪', name: 'Deutschland', lang: 'Deutsch' },
  MA: { flag: '🇲🇦', name: 'المغرب', lang: 'العربية' },
  NL: { flag: '🇳🇱', name: 'Nederland', lang: 'Nederlands' },
} as const;

export const SUPPORTED_COUNTRIES: CountryCode[] = ['FR', 'ES', 'DE', 'MA', 'NL'];
export const DEFAULT_COUNTRY: CountryCode = 'FR';
export const COUNTRY_COOKIE = 'zencall_country';
