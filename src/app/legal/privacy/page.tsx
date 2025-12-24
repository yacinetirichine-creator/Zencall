export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Politique de Confidentialité
        </h1>
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 24 décembre 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Zencall, en tant que responsable du traitement, accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos données conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Données d'inscription</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Nom et prénom</li>
              <li>Adresse email professionnelle</li>
              <li>Numéro de téléphone</li>
              <li>Nom de l'entreprise (pour les comptes B2B)</li>
              <li>SIRET/SIREN (optionnel)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Données d'utilisation</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Logs d'appels (numéros, durée, transcriptions)</li>
              <li>Données de navigation (adresse IP, navigateur)</li>
              <li>Informations techniques (cookies, session)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Données de paiement</h3>
            <p className="text-gray-700 mb-4">
              Les données de paiement sont traitées par notre prestataire Stripe. Zencall ne stocke jamais vos coordonnées bancaires complètes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
            <p className="text-gray-700 mb-3">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Créer et gérer votre compte</li>
              <li>Fournir nos services de téléphonie IA</li>
              <li>Traiter vos paiements</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des communications (avec votre consentement)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale</h2>
            <p className="text-gray-700 mb-3">Le traitement de vos données repose sur :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Exécution du contrat</strong> : fourniture du service</li>
              <li><strong>Consentement</strong> : communications marketing</li>
              <li><strong>Intérêt légitime</strong> : amélioration du service</li>
              <li><strong>Obligation légale</strong> : facturation, conservation comptable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Durée de conservation</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Compte actif</strong> : Pendant toute la durée d'utilisation</li>
              <li><strong>Compte inactif</strong> : 3 ans après dernière connexion</li>
              <li><strong>Données de facturation</strong> : 10 ans (obligation légale)</li>
              <li><strong>Logs d'appels</strong> : 1 an (sauf demande de conservation)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partage des données</h2>
            <p className="text-gray-700 mb-3">Vos données peuvent être partagées avec :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>VAPI.ai</strong> : Traitement des appels vocaux</li>
              <li><strong>Twilio</strong> : Envoi de SMS (si configuré par votre organisation)</li>
              <li><strong>Stripe</strong> : Traitement des paiements</li>
              <li><strong>Supabase</strong> : Hébergement base de données (UE)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Tous nos sous-traitants sont conformes au RGPD et situés dans l'Union Européenne ou disposent de garanties appropriées.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits RGPD</h2>
            <p className="text-gray-700 mb-3">Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Droit d'accès</strong> : Obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : Corriger vos données</li>
              <li><strong>Droit à l'effacement</strong> : Supprimer vos données</li>
              <li><strong>Droit à la portabilité</strong> : Récupérer vos données</li>
              <li><strong>Droit d'opposition</strong> : Refuser un traitement</li>
              <li><strong>Droit à la limitation</strong> : Limiter le traitement</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Pour exercer vos droits, contactez-nous à :{" "}
              <a href="mailto:privacy@zencall.fr" className="text-zencall-coral-600 hover:underline">
                privacy@zencall.fr
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sécurité</h2>
            <p className="text-gray-700 mb-3">
              Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Chiffrement des données en transit (HTTPS/TLS)</li>
              <li>Chiffrement des données sensibles en base</li>
              <li>Authentification sécurisée</li>
              <li>Audits de sécurité réguliers</li>
              <li>Accès restreint aux données</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
            <p className="text-gray-700 mb-3">
              Nous utilisons des cookies pour améliorer votre expérience. Consultez notre{" "}
              <a href="/legal/cookies" className="text-zencall-coral-600 hover:underline">
                politique de cookies
              </a>{" "}
              pour plus d'informations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact</h2>
            <p className="text-gray-700">
              Pour toute question concernant cette politique de confidentialité :<br />
              Email : <a href="mailto:privacy@zencall.fr" className="text-zencall-coral-600 hover:underline">privacy@zencall.fr</a><br />
              Adresse : Zencall SAS, [Adresse complète]<br />
              DPO : [Nom du DPO]
            </p>
            <p className="text-gray-700 mt-4">
              Vous avez également le droit de déposer une réclamation auprès de la CNIL :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-zencall-coral-600 hover:underline">
                www.cnil.fr
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
