'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Mail } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-zencall-mint-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-zencall-mint-600" />
        </div>

        <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Compte créé avec succès !
        </h1>

        <div className="bg-zencall-blue-50 rounded-xl p-4 mb-6">
          <Mail className="w-6 h-6 text-zencall-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-700 mb-2">
            <strong>Vérifiez votre boîte email</strong>
          </p>
          <p className="text-sm text-gray-600">
            Nous avons envoyé un email de confirmation à :
          </p>
          {email && (
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {email}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes :</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-zencall-coral-200 text-gray-900 font-semibold flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                1
              </span>
              <span>Cliquez sur le lien dans l'email de confirmation</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-zencall-coral-200 text-gray-900 font-semibold flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                2
              </span>
              <span>Connectez-vous avec vos identifiants</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-zencall-coral-200 text-gray-900 font-semibold flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                3
              </span>
              <span>Configurez vos intégrations (Twilio, VAPI)</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-zencall-coral-200 text-gray-900 font-semibold flex items-center justify-center mr-3 flex-shrink-0 text-xs">
                4
              </span>
              <span>Créez votre premier assistant vocal</span>
            </li>
          </ol>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou contactez-nous.
        </p>

        <Link
          href="/login"
          className="bg-zencall-coral-200 text-gray-900 px-8 py-3 rounded-xl font-semibold inline-block hover:bg-zencall-coral-300 transition"
        >
          Aller à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zencall-coral-50 via-white to-zencall-blue-50 flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
