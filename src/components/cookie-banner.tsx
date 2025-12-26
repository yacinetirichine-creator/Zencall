'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Banner de consentement cookies - Conforme RGPD
 * Articles 6 (base légale) et 7 (conditions du consentement)
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé (strictement nécessaire)
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookie_consent');
    const cookieValue = getCookie('cookie_consent');
    
    if (!consent && !cookieValue) {
      // Petit délai pour ne pas perturber le chargement initial
      setTimeout(() => setShow(true), 1000);
    } else if (consent) {
      // Charger les préférences sauvegardées
      try {
        setPreferences(JSON.parse(consent));
      } catch (e) {
        console.error('Error parsing cookie preferences:', e);
      }
    }
  }, []);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const savePreferences = (prefs: CookiePreferences) => {
    // Sauvegarder dans localStorage
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    
    // Sauvegarder dans un cookie
    const consentLevel = prefs.marketing ? 'all' : 
                        prefs.analytics ? 'analytics' : 
                        prefs.functional ? 'functional' : 
                        'necessary';
    
    document.cookie = `cookie_consent=${consentLevel}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    
    // Envoyer événement pour analytics (si accepté)
    if (prefs.analytics && typeof window !== 'undefined') {
      // @ts-ignore - gtag peut ne pas être défini si Google Analytics n'est pas chargé
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
    
    setShow(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 mb-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">🍪</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Respect de votre vie privée
            </h2>
            <p className="text-gray-600 text-sm">
              Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic 
              et personnaliser le contenu. Vous pouvez choisir quels cookies accepter.
            </p>
          </div>
        </div>

        {/* Détails des cookies (optionnel) */}
        {showDetails && (
          <div className="mb-6 space-y-4">
            {/* Cookies nécessaires */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookies nécessaires</h3>
                  <p className="text-sm text-gray-600">
                    Essentiels au fonctionnement du site. Ne peuvent pas être désactivés.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5"
                />
              </div>
              <p className="text-xs text-gray-500">
                Ex: Session d'authentification, panier, préférences de langue
              </p>
            </div>

            {/* Cookies fonctionnels */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookies fonctionnels</h3>
                  <p className="text-sm text-gray-600">
                    Permettent d'améliorer votre expérience (préférences, localisation).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="w-5 h-5 accent-zencall-coral-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Ex: Pays sélectionné, thème sombre/clair
              </p>
            </div>

            {/* Cookies analytics */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookies analytics</h3>
                  <p className="text-sm text-gray-600">
                    Nous aident à comprendre comment vous utilisez notre site (anonymisés).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 accent-zencall-coral-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Ex: Google Analytics (données anonymisées)
              </p>
            </div>

            {/* Cookies marketing */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">Cookies marketing</h3>
                  <p className="text-sm text-gray-600">
                    Utilisés pour afficher des publicités pertinentes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-5 h-5 accent-zencall-coral-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Ex: Google Ads, Facebook Pixel
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
          <div className="flex gap-2 text-sm">
            <Link href="/legal/cookies" className="text-zencall-coral-600 hover:underline">
              Politique de cookies
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/legal/privacy" className="text-zencall-coral-600 hover:underline">
              Confidentialité
            </Link>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-zencall-coral-600 hover:underline"
            >
              {showDetails ? 'Masquer' : 'Personnaliser'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={acceptNecessary}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Nécessaires uniquement
            </button>
            
            {showDetails ? (
              <button
                onClick={saveCustom}
                className="px-6 py-2.5 bg-zencall-blue-500 text-white rounded-lg font-medium hover:bg-zencall-blue-600 transition"
              >
                Enregistrer mes choix
              </button>
            ) : null}
            
            <button
              onClick={acceptAll}
              className="px-6 py-2.5 bg-zencall-coral-500 text-white rounded-lg font-medium hover:bg-zencall-coral-600 transition shadow-lg"
            >
              Tout accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
