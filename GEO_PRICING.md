# Geo-Localized Pricing System

## Overview
Zencall now features a sophisticated geo-localized pricing system that automatically detects the user's country and displays pricing in their local currency with market-specific rates.

## Supported Markets

| Country | Currency | VAT Rate | Pricing Strategy |
|---------|----------|----------|------------------|
| 🇫🇷 France | EUR (€) | 20% | Base pricing |
| 🇪🇸 Spain | EUR (€) | 21% | -15% discount |
| 🇩🇪 Germany | EUR (€) | 19% | +20% premium |
| 🇲🇦 Morocco | MAD (د.م.) | 20% | Lower minutes, competitive pricing |
| 🇳🇱 Netherlands | EUR (€) | 21% | Standard EUR pricing |

## Plan Tiers

### Starter
- **France**: 49€/month (200 mins)
- **Spain**: 42€/month (200 mins)
- **Germany**: 59€/month (200 mins)
- **Morocco**: 450 MAD/month (150 mins)
- **Netherlands**: 49€/month (200 mins)

### Pro
- **France**: 149€/month (1000 mins)
- **Spain**: 127€/month (1000 mins)
- **Germany**: 179€/month (1000 mins)
- **Morocco**: 1350 MAD/month (800 mins)
- **Netherlands**: 149€/month (1000 mins)

### Business
- **France**: 299€/month (3000 mins)
- **Spain**: 254€/month (3000 mins)
- **Germany**: 359€/month (3000 mins)
- **Morocco**: 2700 MAD/month (2500 mins)
- **Netherlands**: 299€/month (3000 mins)

### Agency
- **France**: 599€/month (10000 mins)
- **Spain**: 509€/month (10000 mins)
- **Germany**: 719€/month (10000 mins)
- **Morocco**: 5400 MAD/month (8000 mins)
- **Netherlands**: 599€/month (10000 mins)

## Technical Architecture

### Country Detection Flow
1. **Cookie Preference** (`zencall_country`) - Highest priority
2. **Cloudflare Header** (`cf-ipcountry`)
3. **Vercel Header** (`x-vercel-ip-country`)
4. **Default**: France (FR)

### API Routes

#### GET `/api/geo`
Returns detected country and complete pricing data:
```json
{
  "country": "FR",
  "pricing": {
    "currency": "EUR",
    "symbol": "€",
    "locale": "fr-FR",
    "vat": 20,
    "plans": {
      "starter": {
        "price": 49,
        "minutes": 200,
        "extraMinute": 0.25
      }
      // ... other plans
    }
  },
  "supportedCountries": ["FR", "ES", "DE", "MA", "NL"],
  "detectedFrom": "cookie"
}
```

#### POST `/api/geo`
Sets user country preference:
```json
{
  "country": "ES"
}
```

#### POST `/api/analytics/pricing-view`
Tracks pricing page views for analytics:
```json
{
  "country": "FR",
  "plan_viewed": "pro",
  "session_id": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### React Hook: `usePricing()`

```tsx
const {
  country,          // Current country code
  pricing,          // Full pricing data for country
  changeCountry,    // Function to switch country
  loading,          // Loading state
  supportedCountries, // List of available countries
  detectedFrom      // Source of detection
} = usePricing();
```

### Components

#### `<CountrySelector />`
Dropdown for manual country selection with flags and country names.

#### `<PricingCard plan="pro" popular={true} />`
Dynamic pricing card that:
- Displays HT (tax-excluded) and TTC (tax-included) prices
- Shows plan-specific features with dynamic minutes
- Tracks analytics on mount
- Supports 4 plan tiers

## Features

### SEO Optimization
- Dynamic pricing improves local SEO
- Market-specific content increases conversion
- Country-specific URLs possible with middleware

### Analytics Tracking
- Silent failures to not break UX
- Stores: country, plan_viewed, session_id, user_agent, referer
- Table: `analytics_events` in Supabase

### UX Enhancements
- Automatic country detection
- Manual country selector
- Persistent preference via cookie (1 year)
- Fallback to localStorage
- Smooth loading states

## Implementation Files

```
src/
├── lib/pricing/
│   └── countryPricing.ts          # Pricing configuration
├── app/api/
│   ├── geo/route.ts               # Country detection & cookie
│   └── analytics/
│       └── pricing-view/route.ts  # Analytics webhook
├── hooks/
│   └── use-pricing.ts             # Pricing state hook
├── components/
│   ├── pricing/
│   │   ├── country-selector.tsx   # Country dropdown
│   │   └── pricing-card.tsx       # Dynamic pricing card
│   └── landing/
│       └── pricing-section.tsx    # Landing page integration
└── i18n/
    └── messages.ts                # Added "minutesIncluded" key
```

## Cookie Management
- **Name**: `zencall_country`
- **Duration**: 1 year
- **Values**: "FR" | "ES" | "DE" | "MA" | "NL"
- **Path**: /
- **SameSite**: lax

## Future Enhancements
- [ ] Add more countries (UK, IT, BE, CH, etc.)
- [ ] A/B test different pricing strategies
- [ ] Show savings badge for discounted markets
- [ ] Add currency conversion API for real-time rates
- [ ] Implement purchasing power parity (PPP) pricing
- [ ] Multi-currency checkout with Stripe
