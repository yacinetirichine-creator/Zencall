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
    currency: 'EUR',
    symbol: '€',
    locale: 'ar-MA',
    plans: {
      starter: { price: 27, minutes: 50, extraMinute: 0.18 }, // Moins de minutes (coût télécom élevé)
      pro: { price: 92, minutes: 200, extraMinute: 0.17 },
      business: { price: 270, minutes: 800, extraMinute: 0.14 },
      agency: { price: 550, minutes: 2000, extraMinute: 0.11 },
    },
    vat: 20, // TVA marocaine (paiement en EUR via Stripe)
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
  
  UK: {
    currency: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    plans: {
      starter: { price: 25, minutes: 100, extraMinute: 0.08 },
      pro: { price: 85, minutes: 500, extraMinute: 0.07 },
      business: { price: 255, minutes: 2000, extraMinute: 0.06 },
      agency: { price: 515, minutes: 5000, extraMinute: 0.05 },
    },
    vat: 20, // UK VAT
  },
  
  BR: {
    currency: 'BRL',
    symbol: 'R$',
    locale: 'pt-BR',
    plans: {
      starter: { price: 145, minutes: 80, extraMinute: 0.45 }, // ~€28, marché émergent
      pro: { price: 495, minutes: 400, extraMinute: 0.40 },
      business: { price: 1495, minutes: 1600, extraMinute: 0.35 },
      agency: { price: 2995, minutes: 4000, extraMinute: 0.30 },
    },
    vat: 0, // Pas de TVA au Brésil sur services digitaux
  },
  
  IN: {
    currency: 'INR',
    symbol: '₹',
    locale: 'hi-IN',
    plans: {
      starter: { price: 2490, minutes: 60, extraMinute: 7.5 }, // ~€27, adapté pouvoir d'achat
      pro: { price: 8490, minutes: 300, extraMinute: 6.5 },
      business: { price: 24990, minutes: 1200, extraMinute: 5.5 },
      agency: { price: 49990, minutes: 3000, extraMinute: 4.5 },
    },
    vat: 18, // GST indien
  },
  
  CN: {
    currency: 'CNY',
    symbol: '¥',
    locale: 'zh-CN',
    plans: {
      starter: { price: 210, minutes: 80, extraMinute: 0.65 }, // ~€27
      pro: { price: 710, minutes: 400, extraMinute: 0.55 },
      business: { price: 2150, minutes: 1600, extraMinute: 0.50 },
      agency: { price: 4300, minutes: 4000, extraMinute: 0.42 },
    },
    vat: 6, // VAT chinoise
  },
  
  RU: {
    currency: 'EUR',
    symbol: '€',
    locale: 'ru-RU',
    plans: {
      starter: { price: 35, minutes: 70, extraMinute: 0.12 }, // Prix EUR (sanctions)
      pro: { price: 115, minutes: 350, extraMinute: 0.11 },
      business: { price: 345, minutes: 1400, extraMinute: 0.10 },
      agency: { price: 695, minutes: 3500, extraMinute: 0.09 },
    },
    vat: 20, // НДС russe
  },
  
  BD: {
    currency: 'EUR',
    symbol: '€',
    locale: 'bn-BD',
    plans: {
      starter: { price: 22, minutes: 50, extraMinute: 0.13 }, // Marché émergent, prix bas
      pro: { price: 75, minutes: 250, extraMinute: 0.11 },
      business: { price: 225, minutes: 1000, extraMinute: 0.09 },
      agency: { price: 450, minutes: 2500, extraMinute: 0.08 },
    },
    vat: 15, // VAT Bangladesh
  },
  
  PK: {
    currency: 'EUR',
    symbol: '€',
    locale: 'ur-PK',
    plans: {
      starter: { price: 24, minutes: 50, extraMinute: 0.14 }, // Marché émergent
      pro: { price: 82, minutes: 250, extraMinute: 0.12 },
      business: { price: 245, minutes: 1000, extraMinute: 0.10 },
      agency: { price: 490, minutes: 2500, extraMinute: 0.09 },
    },
    vat: 17, // Sales tax Pakistan
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
  UK: { flag: '🇬🇧', name: 'United Kingdom', lang: 'English' },
  BR: { flag: '🇧🇷', name: 'Brasil', lang: 'Português' },
  IN: { flag: '🇮🇳', name: 'भारत', lang: 'हिन्दी' },
  CN: { flag: '🇨🇳', name: '中国', lang: '中文' },
  RU: { flag: '🇷🇺', name: 'Россия', lang: 'Русский' },
  BD: { flag: '🇧🇩', name: 'বাংলাদেশ', lang: 'বাংলা' },
  PK: { flag: '🇵🇰', name: 'پاکستان', lang: 'اردو' },
} as const;

export const SUPPORTED_COUNTRIES: CountryCode[] = ['FR', 'ES', 'DE', 'MA', 'NL', 'UK', 'BR', 'IN', 'CN', 'RU', 'BD', 'PK'];
export const DEFAULT_COUNTRY: CountryCode = 'FR';
export const COUNTRY_COOKIE = 'zencall_country';
