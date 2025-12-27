"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, Check, Loader2, Sparkles } from "lucide-react";

const PLANS = {
  starter: {
    name: 'Starter',
    price: 49,
    minutes: 100,
    popular: false,
    features: [
      '2 assistants IA',
      '1 numéro de téléphone',
      '100 minutes incluses',
      'Support email',
      'Dashboard analytics',
    ],
  },
  pro: {
    name: 'Pro',
    price: 99,
    minutes: 500,
    popular: true,
    features: [
      '5 assistants IA',
      '3 numéros de téléphone',
      '500 minutes incluses',
      'API REST & Webhooks',
      'Support prioritaire',
    ],
  },
  business: {
    name: 'Business',
    price: 199,
    minutes: 2000,
    popular: false,
    features: [
      '10 assistants IA',
      '5 numéros de téléphone',
      '2000 minutes incluses',
      'Campagnes automatisées',
      'Support dédié 24/7',
    ],
  },
};

export default function StripeTestPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleCheckout = async (planType: keyof typeof PLANS) => {
    try {
      setLoading(planType);
      setError(null);

      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Créer la session de checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      const { url } = await response.json();

      // Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Test Paiement Stripe
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Mode TEST - Utilisez les cartes de test Stripe
          </p>
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-6 py-3 mt-4">
            <p className="text-sm text-blue-800 font-mono">
              💳 Carte de test : <strong>4242 4242 4242 4242</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Date future • CVC quelconque • Code postal quelconque
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                plan.popular 
                  ? 'border-zencall-coral-400 scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-zencall-coral-500 to-zencall-coral-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  {plan.minutes} minutes incluses
                </p>

                <button
                  onClick={() => handleCheckout(key as keyof typeof PLANS)}
                  disabled={loading === key}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-zencall-coral-500 hover:bg-zencall-coral-600 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === key ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Tester le paiement
                    </>
                  )}
                </button>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-3">
            📝 Cartes de test Stripe disponibles :
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li><strong>4242 4242 4242 4242</strong> - Paiement réussi</li>
            <li><strong>4000 0025 0000 3155</strong> - Nécessite authentification 3D Secure</li>
            <li><strong>4000 0000 0000 9995</strong> - Carte refusée (fonds insuffisants)</li>
            <li><strong>4000 0000 0000 0002</strong> - Carte refusée (générique)</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔗 <a href="https://dashboard.stripe.com/test/payments" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Voir les paiements dans Stripe Dashboard
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            🏠 <a href="/dashboard" className="text-blue-600 hover:underline">
              Retour au Dashboard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
