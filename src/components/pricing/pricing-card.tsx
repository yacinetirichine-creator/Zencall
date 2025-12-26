"use client";

import { usePricing } from '@/hooks/use-pricing';
import { type PlanTier } from '@/lib/pricing/countryPricing';
import { Check } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
import { useEffect } from 'react';
import Link from 'next/link';

interface PricingCardProps {
  plan: PlanTier;
  popular?: boolean;
}

export function PricingCard({ plan, popular = false }: PricingCardProps) {
  const { pricing, loading, country } = usePricing();
  const { t } = useI18n();
  
  // Track pricing view for analytics
  useEffect(() => {
    if (!loading && country) {
      const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
      
      fetch('/api/analytics/pricing-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          plan_viewed: plan,
          session_id: sessionId,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}); // Silent fail pour analytics
    }
  }, [loading, country, plan]);
  
  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl" />;
  }
  
  const planData = pricing.plans[plan];
  const { symbol, vat } = pricing;
  
  // Calcul prix TTC
  const priceHT = planData.price;
  const priceTTC = priceHT * (1 + vat / 100);
  
  // Mapping des features selon le plan (identique à l'ancienne version mais avec minutes dynamiques)
  const features = {
    starter: [
      `${planData.minutes} ${t('pricing.minutesIncluded') || 'minutes incluses'}`,
      '2 assistants',
      '1 numéro',
      'Support email',
    ],
    pro: [
      `${planData.minutes} ${t('pricing.minutesIncluded') || 'minutes incluses'}`,
      '5 assistants',
      '3 numéros',
      'API REST',
      'Webhooks',
    ],
    business: [
      `${planData.minutes} ${t('pricing.minutesIncluded') || 'minutes incluses'}`,
      '10 assistants',
      '5 numéros',
      'Campagnes',
      'Support prioritaire',
    ],
    agency: [
      `${planData.minutes} ${t('pricing.minutesIncluded') || 'minutes incluses'}`,
      'Assistants illimités',
      '10 numéros',
      'Campagnes avancées',
      'Support dédié 24/7',
      'SLA garanti',
    ],
  };

  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
      popular ? 'border-zencall-coral-500' : 'border-transparent'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-zencall-coral-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
          {t("pricing.mostPopular") || "Le plus populaire"}
        </div>
      )}
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
        {planName}
      </h3>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-5xl font-bold text-gray-900">
          {symbol}{priceHT}
        </span>
        <span className="text-gray-500">{t("pricing.perMonth") || "/mois"}</span>
      </div>
      
      <p className="text-sm text-gray-500 mb-6">
        ({symbol}{priceTTC.toFixed(2)} TTC · TVA {vat}%)
      </p>
      
      <div className="bg-zencall-blue-50 rounded-xl p-4 mb-6 text-center">
        <span className="block text-2xl font-bold text-zencall-blue-600">
          {planData.minutes} min
        </span>
        <span className="text-sm text-zencall-blue-400">
          {t("pricing.includedCalls") || "d'appels inclus"}
        </span>
        <p className="text-xs text-gray-600 mt-1">
          + {symbol}{planData.extraMinute}/min supplémentaire
        </p>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features[plan].map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 rounded-full bg-zencall-mint-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-zencall-mint-600" />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link
        href="/register"
        className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${
          popular
            ? 'bg-zencall-coral-500 text-white hover:bg-zencall-coral-600 shadow-lg'
            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
        }`}
      >
        {t("pricing.choosePlan", { plan: planName }) || `Choisir ${planName}`}
      </Link>
    </div>
  );
}
