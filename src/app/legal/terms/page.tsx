export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : 24 décembre 2025
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objet</h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Zencall, service d'assistant téléphonique intelligent proposé par Zencall SAS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Définitions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Plateforme</strong> : L'ensemble des services Zencall accessibles via l'application web</li>
              <li><strong>Utilisateur</strong> : Toute personne ayant créé un compte</li>
              <li><strong>Organisation</strong> : Entité juridique souscrivant à nos services</li>
              <li><strong>Assistant</strong> : Agent conversationnel IA configuré par l'utilisateur</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Accès au service</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Inscription</h3>
            <p className="text-gray-700 mb-4">
              L'accès à Zencall nécessite la création d'un compte. Vous vous engagez à fournir des informations exactes et à jour.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Comptes B2B et B2C</h3>
            <p className="text-gray-700 mb-4">
              Deux types de comptes sont disponibles : Entreprise (B2B) et Personnel (B2C). Les fonctionnalités et tarifs diffèrent selon le type de compte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Description des services</h2>
            <p className="text-gray-700 mb-3">Zencall propose :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Création et gestion d'assistants téléphoniques IA</li>
              <li>Traitement d'appels entrants et sortants</li>
              <li>Transcription et analyse des conversations</li>
              <li>Prise de rendez-vous automatisée</li>
              <li>Campagnes d'appels automatisées</li>
              <li>Intégrations tierces (Calendriers, CRM, SMS)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Obligations de l'utilisateur</h2>
            <p className="text-gray-700 mb-3">Vous vous engagez à :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Utiliser le service de manière conforme à la loi</li>
              <li>Ne pas utiliser le service pour du spam ou démarchage abusif</li>
              <li>Respecter les réglementations sur la protection des données (RGPD)</li>
              <li>Informer vos interlocuteurs de l'utilisation d'un assistant IA</li>
              <li>Ne pas tenter de contourner les limitations techniques</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tarification</h2>
            <p className="text-gray-700 mb-4">
              Les tarifs sont disponibles sur notre site web. Nous nous réservons le droit de modifier nos tarifs moyennant un préavis de 30 jours.
            </p>
            <p className="text-gray-700 mb-3">La facturation comprend :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Abonnement mensuel selon le plan choisi</li>
              <li>Coût des appels (variable selon usage)</li>
              <li>Services additionnels (si souscrits)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intégrations tierces</h2>
            <p className="text-gray-700 mb-4">
              Zencall permet l'intégration avec des services tiers (VAPI, Twilio, etc.). Vous devez configurer vos propres comptes auprès de ces services.
            </p>
            <p className="text-gray-700">
              Zencall n'est pas responsable des services tiers. Vous devez accepter leurs conditions d'utilisation respectives.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-4">
              Tous les éléments de la plateforme Zencall (code, design, marque) sont protégés par le droit d'auteur.
            </p>
            <p className="text-gray-700">
              Vous conservez la propriété de vos données (transcriptions, contacts, etc.).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation de responsabilité</h2>
            <p className="text-gray-700 mb-3">
              Zencall s'engage à fournir un service de qualité mais ne garantit pas :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Un fonctionnement ininterrompu (maintenance, pannes)</li>
              <li>L'exactitude à 100% des transcriptions IA</li>
              <li>La disponibilité des services tiers</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Notre responsabilité est limitée au montant de votre abonnement mensuel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Résiliation</h2>
            <p className="text-gray-700 mb-4">
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace client. La résiliation prend effet à la fin de la période en cours.
            </p>
            <p className="text-gray-700">
              Zencall se réserve le droit de suspendre ou résilier votre compte en cas de non-respect des CGU.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Loi applicable</h2>
            <p className="text-gray-700">
              Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
            <p className="text-gray-700">
              Pour toute question relative aux CGU :<br />
              Email : <a href="mailto:legal@zencall.fr" className="text-zencall-coral-600 hover:underline">legal@zencall.fr</a><br />
              Adresse : Zencall SAS, [Adresse complète]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
