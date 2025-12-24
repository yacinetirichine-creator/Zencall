'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft, Building, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'b2b' | 'b2c' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    // B2B fields
    companyName: '',
    companyRegistration: '',
    vatNumber: '',
    // GDPR consents
    termsAccepted: false,
    privacyAccepted: false,
    marketingConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setError('Vous devez accepter les conditions générales et la politique de confidentialité');
      return;
    }

    if (accountType === 'b2b' && !formData.companyName) {
      setError('Le nom de l\'entreprise est requis pour un compte B2B');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizationType: accountType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-zencall-mint-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-zencall-mint-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
          <p className="text-gray-600 mb-6">
            Nous avons envoyé un lien de confirmation à <strong>{formData.email}</strong>
          </p>
          <Link
            href="/login"
            className="bg-zencall-coral-200 text-gray-800 px-6 py-2.5 rounded-xl font-medium inline-block hover:bg-zencall-coral-300 transition"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // Step 1: Account type selection
  if (!accountType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">Créer un compte Zencall</h1>
            <p className="text-lg text-gray-600">Choisissez le type de compte qui vous convient</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* B2B Card */}
            <div
              onClick={() => setAccountType('b2b')}
              className="bg-white rounded-2xl shadow-soft border-2 border-gray-200 hover:border-zencall-coral-300 p-8 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-zencall-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-zencall-blue-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Entreprise (B2B)</h2>
              <p className="text-gray-600 mb-6">
                Pour les entreprises qui souhaitent gérer leurs appels professionnels avec une équipe
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Gestion d'équipe et collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Facturation entreprise</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Conformité RGPD complète</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Intégrations avancées</span>
                </li>
              </ul>
              <button className="w-full bg-zencall-blue-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-zencall-blue-300 transition">
                Choisir B2B
              </button>
            </div>

            {/* B2C Card */}
            <div
              onClick={() => setAccountType('b2c')}
              className="bg-white rounded-2xl shadow-soft border-2 border-gray-200 hover:border-zencall-coral-300 p-8 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-zencall-coral-100 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-zencall-coral-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Particulier (B2C)</h2>
              <p className="text-gray-600 mb-6">
                Pour les professionnels indépendants et les particuliers
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Configuration simple et rapide</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Tarification avantageuse</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Toutes les fonctionnalités essentielles</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-zencall-mint-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Sans engagement</span>
                </li>
              </ul>
              <button className="w-full bg-zencall-coral-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-zencall-coral-300 transition">
                Choisir B2C
              </button>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-8">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-zencall-coral-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 w-full max-w-2xl p-8">
        <button
          onClick={() => setAccountType(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au choix du type de compte
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Inscription {accountType === 'b2b' ? 'Entreprise' : 'Particulier'}
          </h1>
          <p className="text-gray-600">Complétez vos informations</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Informations personnelles</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
              <input
                type="text"
                placeholder="Jean Dupont"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                placeholder="jean@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                <input
                  type="password"
                  placeholder="Min. 8 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company info (B2B only) */}
          {accountType === 'b2b' && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg text-gray-900">Informations entreprise</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise *</label>
                <input
                  type="text"
                  placeholder="Ma Société SARL"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SIRET/SIREN</label>
                  <input
                    type="text"
                    placeholder="123 456 789 00010"
                    value={formData.companyRegistration}
                    onChange={(e) => setFormData({ ...formData, companyRegistration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro TVA</label>
                  <input
                    type="text"
                    placeholder="FR12345678901"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-zencall-coral-200 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* GDPR consents */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Consentements RGPD</h3>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 text-zencall-coral-600 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                J'accepte les{' '}
                <Link href="/legal/terms" target="_blank" className="text-zencall-coral-600 hover:underline font-semibold">
                  conditions générales d'utilisation
                </Link>{' '}
                *
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 text-zencall-coral-600 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                J'accepte la{' '}
                <Link href="/legal/privacy" target="_blank" className="text-zencall-coral-600 hover:underline font-semibold">
                  politique de confidentialité
                </Link>{' '}
                *
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                className="mt-1 w-4 h-4 text-zencall-coral-600 rounded"
              />
              <span className="text-sm text-gray-700">
                J'accepte de recevoir des communications marketing (optionnel)
              </span>
            </label>

            <p className="text-xs text-gray-500 mt-4 bg-gray-50 p-3 rounded-lg">
              <strong>Protection de vos données :</strong> Conformément au RGPD, vous pouvez exercer vos droits 
              d'accès, rectification, suppression et portabilité depuis votre compte.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zencall-coral-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-zencall-coral-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-zencall-coral-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
