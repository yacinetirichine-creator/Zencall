export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">
            Politique de Confidentialité et de Protection des Données Personnelles
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Version 1.0</strong><br />
              Dernière mise à jour : 26 décembre 2025<br />
              Entrée en vigueur : 26 décembre 2025
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-900">
                <strong>Important :</strong> Cette Politique de Confidentialité décrit de manière exhaustive comment JARVIS collecte, utilise, stocke et protège vos données personnelles dans le cadre de l'utilisation de Zencall. Nous vous recommandons de la lire attentivement.
              </p>
            </div>

            {/* Article 1 - Identité du Responsable de Traitement */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 1 - Identité du Responsable de Traitement</h2>
              <p className="mb-4">
                Le responsable du traitement de vos données personnelles est :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="mb-2"><strong>JARVIS</strong></p>
                <p className="mb-2">Société par actions simplifiée (SAS)</p>
                <p className="mb-2">Immatriculée au RCS de [VILLE] sous le numéro [NUMÉRO KBIS]</p>
                <p className="mb-2">Siège social : [ADRESSE COMPLÈTE]</p>
                <p className="mb-2">Email : privacy@zencall.ai</p>
                <p className="mb-2">Téléphone : [NUMÉRO]</p>
              </div>
              <p className="mb-4">
                Ci-après dénommé « JARVIS », « nous », « notre » ou « nos ».
              </p>
            </section>

            {/* Article 2 - Délégué à la Protection des Données (DPO) */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 2 - Délégué à la Protection des Données (DPO)</h2>
              <p className="mb-4">
                Conformément à l'article 37 du RGPD, JARVIS a désigné un Délégué à la Protection des Données (DPO) que vous pouvez contacter pour toute question relative au traitement de vos données personnelles :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="mb-2"><strong>Délégué à la Protection des Données</strong></p>
                <p className="mb-2">Email : dpo@zencall.ai</p>
                <p className="mb-2">Adresse postale : JARVIS - DPO, [ADRESSE COMPLÈTE]</p>
              </div>
              <p className="mb-4">
                Le DPO est votre interlocuteur privilégié pour l'exercice de vos droits et pour toute réclamation concernant le traitement de vos données.
              </p>
            </section>

            {/* Article 3 - Champ d'Application */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 3 - Champ d'Application</h2>
              <p className="mb-4">
                La présente Politique de Confidentialité s'applique à l'ensemble des traitements de données personnelles effectués dans le cadre :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>De l'utilisation de la plateforme Zencall (Site web, Application web, API)</li>
                <li>De la souscription et de la gestion de votre compte client</li>
                <li>De l'utilisation des services d'assistants téléphoniques virtuels alimentés par IA</li>
                <li>De la facturation et du paiement</li>
                <li>Du support client et de la relation commerciale</li>
                <li>De nos communications marketing (sous réserve de votre consentement)</li>
              </ul>
              <p className="mb-4">
                Elle s'applique à tous les utilisateurs, qu'ils soient personnes physiques agissant à titre personnel ou dans le cadre de leur activité professionnelle.
              </p>
            </section>

            {/* Article 4 - Principes Fondamentaux */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 4 - Principes Fondamentaux du Traitement</h2>
              <p className="mb-4">
                Conformément au RGPD (Règlement Général sur la Protection des Données UE 2016/679), nous nous engageons à respecter les principes suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Licéité, loyauté, transparence :</strong> Vos données sont collectées de manière licite, loyale et transparente.</li>
                <li><strong>Limitation des finalités :</strong> Les données sont collectées pour des finalités déterminées, explicites et légitimes.</li>
                <li><strong>Minimisation des données :</strong> Seules les données strictement nécessaires sont collectées.</li>
                <li><strong>Exactitude :</strong> Nous mettons tout en œuvre pour garantir l'exactitude et la mise à jour de vos données.</li>
                <li><strong>Limitation de la conservation :</strong> Vos données ne sont conservées que le temps nécessaire aux finalités poursuivies.</li>
                <li><strong>Intégrité et confidentialité :</strong> Vos données sont protégées par des mesures de sécurité techniques et organisationnelles appropriées.</li>
                <li><strong>Responsabilité :</strong> Nous sommes en mesure de démontrer notre conformité au RGPD.</li>
              </ul>
            </section>

            {/* Article 5 - Données Collectées */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 5 - Données Personnelles Collectées</h2>
              
              <h3 className="text-xl font-semibold mb-3">5.1. Données d'Identification</h3>
              <p className="mb-4">Lors de la création de votre compte et de l'utilisation des services :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Nom de l'organisation/entreprise</li>
                <li>Fonction dans l'entreprise</li>
                <li>Adresse postale (si fournie)</li>
                <li>Pays de résidence</li>
                <li>Langue préférée</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.2. Données de Connexion et Techniques</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Identifiant de compte</li>
                <li>Mot de passe (stocké sous forme cryptée)</li>
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d'exploitation</li>
                <li>Logs de connexion (date, heure, durée)</li>
                <li>Cookies et identifiants de session</li>
                <li>User-Agent</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.3. Données de Facturation et de Paiement</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Informations de facturation (adresse, TVA intracommunautaire si applicable)</li>
                <li>Données de carte bancaire (traitées par notre prestataire de paiement Stripe - voir Article 10)</li>
                <li>Historique des transactions</li>
                <li>Factures et reçus</li>
                <li>Plan tarifaire souscrit</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.4. Données d'Utilisation du Service</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Enregistrements audio des appels téléphoniques traités par nos assistants IA</li>
                <li>Transcriptions des conversations</li>
                <li>Métadonnées des appels (date, heure, durée, numéro appelant, numéro appelé)</li>
                <li>Configuration des assistants virtuels (nom, voix, instructions, scénarios)</li>
                <li>Données des contacts importés (nom, téléphone, email, notes)</li>
                <li>Historique des rendez-vous créés</li>
                <li>Statistiques d'utilisation (nombre d'appels, minutes consommées, etc.)</li>
                <li>Campagnes marketing créées (listes de contacts, messages, planifications)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.5. Données de Communication</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Emails échangés avec notre support client</li>
                <li>Messages via le chat en ligne</li>
                <li>Tickets de support et leur contenu</li>
                <li>Enquêtes de satisfaction et feedbacks</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.6. Données Analytics et Marketing</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Comportement de navigation sur le site</li>
                <li>Pages visitées et temps passé</li>
                <li>Source d'acquisition (publicité, référencement, etc.)</li>
                <li>Interactions avec nos emails marketing (ouverture, clics)</li>
                <li>Préférences de communication</li>
              </ul>
            </section>

            {/* Article 6 - Finalités et Bases Légales */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 6 - Finalités et Bases Légales du Traitement</h2>
              
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Finalité</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Données Concernées</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Base Légale (RGPD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Création et gestion de votre compte</td>
                      <td className="border border-gray-300 px-4 py-2">Identification, connexion</td>
                      <td className="border border-gray-300 px-4 py-2">Exécution du contrat (Art. 6.1.b)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Fourniture des services Zencall</td>
                      <td className="border border-gray-300 px-4 py-2">Toutes données d'utilisation</td>
                      <td className="border border-gray-300 px-4 py-2">Exécution du contrat (Art. 6.1.b)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Facturation et paiement</td>
                      <td className="border border-gray-300 px-4 py-2">Données de facturation et paiement</td>
                      <td className="border border-gray-300 px-4 py-2">Exécution du contrat (Art. 6.1.b)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Support client</td>
                      <td className="border border-gray-300 px-4 py-2">Communication, utilisation</td>
                      <td className="border border-gray-300 px-4 py-2">Intérêt légitime (Art. 6.1.f)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Amélioration des services</td>
                      <td className="border border-gray-300 px-4 py-2">Données d'utilisation, analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Intérêt légitime (Art. 6.1.f)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Communications marketing</td>
                      <td className="border border-gray-300 px-4 py-2">Email, préférences</td>
                      <td className="border border-gray-300 px-4 py-2">Consentement (Art. 6.1.a)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Prévention de la fraude</td>
                      <td className="border border-gray-300 px-4 py-2">Connexion, paiement</td>
                      <td className="border border-gray-300 px-4 py-2">Intérêt légitime (Art. 6.1.f)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Obligations légales et fiscales</td>
                      <td className="border border-gray-300 px-4 py-2">Facturation, paiement</td>
                      <td className="border border-gray-300 px-4 py-2">Obligation légale (Art. 6.1.c)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Gestion des litiges</td>
                      <td className="border border-gray-300 px-4 py-2">Toutes données pertinentes</td>
                      <td className="border border-gray-300 px-4 py-2">Intérêt légitime (Art. 6.1.f)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Article 7 - Destinataires des Données */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 7 - Destinataires des Données</h2>
              
              <h3 className="text-xl font-semibold mb-3">7.1. Personnel Autorisé de JARVIS</h3>
              <p className="mb-4">
                Vos données sont accessibles aux employés de JARVIS dans la stricte limite de leurs attributions et sous réserve d'une obligation de confidentialité renforcée.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.2. Sous-traitants et Prestataires</h3>
              <p className="mb-4">
                Nous faisons appel à des prestataires de services soigneusement sélectionnés qui traitent vos données pour notre compte :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Hébergement :</strong> Supabase (infrastructure cloud sécurisée)</li>
                <li><strong>Paiement :</strong> Stripe (traitement sécurisé des paiements)</li>
                <li><strong>Téléphonie :</strong> Twilio (infrastructure téléphonique)</li>
                <li><strong>Intelligence Artificielle :</strong> Vapi.ai (traitement vocal par IA)</li>
              </ul>
              <p className="mb-4">
                Tous ces prestataires sont liés à JARVIS par des contrats de sous-traitance conformes à l'article 28 du RGPD, garantissant la sécurité et la confidentialité de vos données.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.3. Autorités Compétentes</h3>
              <p className="mb-4">
                Vos données peuvent être communiquées aux autorités judiciaires, fiscales, administratives ou de police sur réquisition légale ou dans le cadre de nos obligations légales.
              </p>

              <h3 className="text-xl font-semibold mb-3">7.4. Absence de Vente ou Location</h3>
              <p className="mb-4">
                <strong>JARVIS s'engage fermement à ne jamais vendre, louer ou échanger vos données personnelles à des tiers à des fins commerciales.</strong>
              </p>
            </section>

            {/* Article 8 - Transferts Internationaux */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 8 - Transferts Internationaux de Données</h2>
              
              <p className="mb-4">
                Dans le cadre de la fourniture de nos services, certaines de vos données peuvent être transférées et traitées dans des pays situés en dehors de l'Espace Économique Européen (EEE).
              </p>

              <h3 className="text-xl font-semibold mb-3">8.1. Garanties Applicables</h3>
              <p className="mb-4">
                Lorsque vos données sont transférées vers des pays tiers, JARVIS s'assure que ces transferts sont encadrés par des garanties appropriées :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Clauses Contractuelles Types (CCT) :</strong> Adoptées par la Commission Européenne conformément à l'article 46 du RGPD</li>
                <li><strong>Décisions d'adéquation :</strong> Pour les pays reconnus comme offrant un niveau de protection adéquat par la Commission Européenne</li>
                <li><strong>Certifications :</strong> Privacy Shield successeur ou équivalent pour les prestataires américains</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">8.2. Prestataires Concernés</h3>
              <p className="mb-4">
                Les transferts internationaux concernent principalement :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Stripe (USA) - Paiements sécurisés (décision d'adéquation UE-USA Data Privacy Framework)</li>
                <li>Twilio (USA) - Infrastructure téléphonique (CCT en vigueur)</li>
                <li>Vapi.ai (USA) - Traitement IA vocal (CCT en vigueur)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">8.3. Droit d'Information</h3>
              <p className="mb-4">
                Vous pouvez obtenir une copie des garanties mises en place pour encadrer les transferts internationaux en contactant notre DPO à dpo@zencall.ai.
              </p>
            </section>

            {/* Article 9 - Durée de Conservation */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 9 - Durée de Conservation des Données</h2>
              
              <p className="mb-4">
                Vos données personnelles sont conservées pour la durée strictement nécessaire aux finalités poursuivies, conformément aux recommandations de la CNIL et aux obligations légales.
              </p>

              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Catégorie de Données</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Durée de Conservation (Base Active)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Archivage Intermédiaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Compte client actif</td>
                      <td className="border border-gray-300 px-4 py-2">Durée de la relation contractuelle</td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Données après résiliation</td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                      <td className="border border-gray-300 px-4 py-2">3 ans à compter de la fin de la relation</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Enregistrements d'appels</td>
                      <td className="border border-gray-300 px-4 py-2">6 mois maximum (sauf demande contraire)</td>
                      <td className="border border-gray-300 px-4 py-2">Possibilité d'archivage sur demande jusqu'à 3 ans</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Données de facturation</td>
                      <td className="border border-gray-300 px-4 py-2">Durée de la relation + exercice en cours</td>
                      <td className="border border-gray-300 px-4 py-2">10 ans (obligation fiscale)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Logs de connexion</td>
                      <td className="border border-gray-300 px-4 py-2">12 mois</td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Cookies analytics</td>
                      <td className="border border-gray-300 px-4 py-2">13 mois maximum</td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Prospects (sans compte)</td>
                      <td className="border border-gray-300 px-4 py-2">3 ans à compter du dernier contact</td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Support client</td>
                      <td className="border border-gray-300 px-4 py-2">Durée de la relation + 3 ans</td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mb-4">
                À l'expiration de ces durées, vos données sont soit supprimées définitivement, soit anonymisées de manière irréversible à des fins statistiques.
              </p>

              <p className="mb-4">
                <strong>Droit de suppression anticipée :</strong> Vous pouvez à tout moment demander la suppression de vos données en exerçant votre droit à l'effacement (voir Article 12).
              </p>
            </section>

            {/* Article 10 - Sécurité et Confidentialité */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 10 - Mesures de Sécurité et de Confidentialité</h2>
              
              <p className="mb-4">
                JARVIS met en œuvre des mesures de sécurité techniques et organisationnelles de pointe pour protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération.
              </p>

              <h3 className="text-xl font-semibold mb-3">10.1. Mesures Techniques</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Chiffrement :</strong> Chiffrement AES-256-GCM pour les données sensibles au repos et TLS 1.3 pour les données en transit</li>
                <li><strong>Authentification renforcée :</strong> Hashage bcrypt des mots de passe, possibilité d'authentification à deux facteurs (2FA)</li>
                <li><strong>Isolation des données :</strong> Row-Level Security (RLS) sur Supabase garantissant la séparation stricte des données entre organisations</li>
                <li><strong>Pare-feu et détection d'intrusion :</strong> Surveillance 24/7, WAF (Web Application Firewall), protection DDoS</li>
                <li><strong>Limitation de débit (Rate Limiting) :</strong> Protection contre les attaques par force brute et les abus</li>
                <li><strong>Sauvegardes chiffrées :</strong> Sauvegardes quotidiennes automatiques avec chiffrement et stockage géographiquement distribué</li>
                <li><strong>Surveillance et logs :</strong> Journalisation des accès et des actions sensibles pour audit et détection d'anomalies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">10.2. Mesures Organisationnelles</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Accès restreint :</strong> Principe du moindre privilège - seuls les employés habilités ont accès aux données</li>
                <li><strong>Formation :</strong> Sensibilisation régulière du personnel aux enjeux de protection des données</li>
                <li><strong>Politiques internes :</strong> Charte de sécurité, procédures de gestion des incidents, politique de mots de passe</li>
                <li><strong>Audits réguliers :</strong> Tests de pénétration, audits de sécurité, revues de code</li>
                <li><strong>Contrats de confidentialité :</strong> Tous les employés et prestataires sont soumis à une obligation de confidentialité stricte</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">10.3. Gestion des Violations de Données</h3>
              <p className="mb-4">
                En cas de violation de données personnelles susceptible d'engendrer un risque pour vos droits et libertés, JARVIS s'engage à :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Notifier la CNIL dans un délai de 72 heures suivant la découverte de la violation (Art. 33 RGPD)</li>
                <li>Vous informer sans délai si la violation présente un risque élevé pour vous (Art. 34 RGPD)</li>
                <li>Documenter la violation et les mesures correctives prises</li>
                <li>Mettre en œuvre immédiatement des actions de remédiation</li>
              </ul>
            </section>

            {/* Article 11 - Cookies et Technologies Similaires */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 11 - Cookies et Technologies de Traçage</h2>
              
              <p className="mb-4">
                Zencall utilise des cookies et des technologies similaires pour améliorer votre expérience utilisateur et analyser l'utilisation de nos services.
              </p>

              <h3 className="text-xl font-semibold mb-3">11.1. Types de Cookies Utilisés</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Cookies strictement nécessaires :</strong> Indispensables au fonctionnement du site (authentification, sécurité, préférences de session). <em>Base légale : Intérêt légitime - pas de consentement requis.</em></li>
                <li><strong>Cookies de performance et analytics :</strong> Nous permettent de mesurer l'audience et d'améliorer nos services. <em>Base légale : Consentement.</em></li>
                <li><strong>Cookies marketing :</strong> Utilisés pour personnaliser les publicités et mesurer l'efficacité des campagnes. <em>Base légale : Consentement.</em></li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">11.2. Gestion de Vos Préférences</h3>
              <p className="mb-4">
                Lors de votre première visite, un bandeau de consentement vous permet de choisir les catégories de cookies que vous acceptez. Vous pouvez modifier vos choix à tout moment via :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Le lien "Gérer les cookies" présent en pied de page</li>
                <li>Les paramètres de votre navigateur (désactivation globale des cookies)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">11.3. Durée de Conservation</h3>
              <p className="mb-4">
                Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL. Votre consentement est redemandé après cette période.
              </p>
            </section>

            {/* Article 12 - Vos Droits RGPD */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 12 - Vos Droits sur Vos Données Personnelles</h2>
              
              <p className="mb-4">
                Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données personnelles :
              </p>

              <h3 className="text-xl font-semibold mb-3">12.1. Droit d'Accès (Art. 15 RGPD)</h3>
              <p className="mb-4">
                Vous avez le droit d'obtenir la confirmation que vos données sont ou ne sont pas traitées, et si tel est le cas, d'accéder à vos données ainsi qu'aux informations sur les finalités du traitement, les catégories de données concernées, les destinataires, et la durée de conservation.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.2. Droit de Rectification (Art. 16 RGPD)</h3>
              <p className="mb-4">
                Vous pouvez demander la rectification de vos données inexactes ou incomplètes à tout moment. Vous pouvez également mettre à jour vos informations directement depuis votre espace client.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.3. Droit à l'Effacement - "Droit à l'Oubli" (Art. 17 RGPD)</h3>
              <p className="mb-4">
                Vous pouvez demander la suppression de vos données lorsqu'elles ne sont plus nécessaires, que vous retirez votre consentement, que vous vous opposez au traitement, ou qu'elles ont été collectées de manière illicite.
              </p>
              <p className="mb-4">
                <strong>Limitations :</strong> Ce droit ne s'applique pas si la conservation est nécessaire pour respecter une obligation légale (ex: facturation - 10 ans) ou pour la constatation, l'exercice ou la défense de droits en justice.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.4. Droit à la Limitation du Traitement (Art. 18 RGPD)</h3>
              <p className="mb-4">
                Vous pouvez demander le gel de vos données si vous contestez leur exactitude, si le traitement est illicite, si vous en avez besoin pour un recours juridique, ou si vous vous êtes opposé au traitement.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.5. Droit à la Portabilité (Art. 20 RGPD)</h3>
              <p className="mb-4">
                Vous avez le droit de recevoir vos données dans un format structuré, couramment utilisé et lisible par machine (CSV, JSON) et de les transmettre à un autre responsable de traitement.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.6. Droit d'Opposition (Art. 21 RGPD)</h3>
              <p className="mb-4">
                Vous pouvez vous opposer à tout moment au traitement de vos données fondé sur l'intérêt légitime de JARVIS, et de manière absolue au traitement de vos données à des fins de prospection commerciale.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.7. Exercice de Vos Droits</h3>
              <p className="mb-4">
                Pour exercer l'un de ces droits, contactez-nous par :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Email :</strong> dpo@zencall.ai (recommandé)</li>
                <li><strong>Courrier postal :</strong> JARVIS - DPO, [ADRESSE COMPLÈTE]</li>
              </ul>
              <p className="mb-4">
                <strong>Délai de réponse :</strong> JARVIS s'engage à répondre à votre demande dans un délai maximum d'<strong>1 mois</strong> à compter de la réception. Ce délai peut être prolongé de 2 mois supplémentaires compte tenu de la complexité de la demande (vous en serez informé).
              </p>
            </section>

            {/* Article 13 - Droit de Réclamation */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 13 - Droit de Réclamation Auprès de la CNIL</h2>
              
              <p className="mb-4">
                Si vous estimez que JARVIS ne respecte pas vos droits concernant vos données personnelles, vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="mb-2"><strong>CNIL</strong></p>
                <p className="mb-2">3 Place de Fontenoy - TSA 80715</p>
                <p className="mb-2">75334 PARIS CEDEX 07</p>
                <p className="mb-2">Téléphone : 01 53 73 22 22</p>
                <p className="mb-2">Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a></p>
                <p className="mb-2">Formulaire de plainte en ligne : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr/fr/plaintes</a></p>
              </div>
            </section>

            {/* Article 14 - Mineurs */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 14 - Protection des Mineurs</h2>
              
              <p className="mb-4">
                Les services Zencall sont destinés aux personnes majeures (18 ans et plus) ou aux mineurs émancipés.
              </p>
              <p className="mb-4">
                JARVIS ne collecte pas sciemment de données personnelles concernant des mineurs de moins de 15 ans. Si nous découvrons qu'un mineur nous a fourni des données personnelles, nous supprimerons ces informations dans les plus brefs délais.
              </p>
              <p className="mb-4">
                Si vous êtes parent ou tuteur légal et que vous avez connaissance que votre enfant nous a fourni des données personnelles, contactez-nous immédiatement à dpo@zencall.ai.
              </p>
            </section>

            {/* Article 15 - Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 15 - Modifications de la Politique de Confidentialité</h2>
              
              <p className="mb-4">
                JARVIS se réserve le droit de modifier la présente Politique de Confidentialité à tout moment pour refléter les évolutions légales et réglementaires, les évolutions de nos pratiques de traitement, les améliorations de nos services, ou les recommandations de la CNIL ou d'autres autorités compétentes.
              </p>
              <p className="mb-4">
                <strong>Notification des modifications :</strong> En cas de modification substantielle, nous vous en informerons par email, notification dans votre espace client, ou bandeau d'information sur le site web.
              </p>
              <p className="mb-4">
                <strong>Date d'entrée en vigueur :</strong> Les modifications entrent en vigueur à la date indiquée dans la version mise à jour. La date de dernière mise à jour est systématiquement affichée en haut de cette page.
              </p>
            </section>

            {/* Article 16 - Législation Applicable */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 16 - Législation Applicable et Juridiction</h2>
              
              <p className="mb-4">
                La présente Politique de Confidentialité est régie par le droit français et notamment :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Le Règlement Général sur la Protection des Données (RGPD - UE 2016/679)</li>
                <li>La loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés (Loi Informatique et Libertés modifiée)</li>
                <li>La directive ePrivacy 2002/58/CE transposée en droit français</li>
                <li>Le Code de la consommation</li>
                <li>Le Code civil</li>
              </ul>
              <p className="mb-4">
                <strong>Juridiction compétente :</strong> En cas de litige relatif à l'interprétation ou à l'exécution de la présente politique, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
              </p>
            </section>

            {/* Article 17 - Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Article 17 - Nous Contacter</h2>
              
              <p className="mb-4">
                Pour toute question, demande d'information ou exercice de vos droits concernant vos données personnelles :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="mb-3"><strong>Délégué à la Protection des Données (DPO)</strong></p>
                <p className="mb-2">📧 <strong>Email :</strong> dpo@zencall.ai</p>
                <p className="mb-2">📮 <strong>Courrier :</strong> JARVIS - DPO, [ADRESSE COMPLÈTE]</p>
                <p className="mb-3">📞 <strong>Téléphone :</strong> [NUMÉRO]</p>
                
                <p className="mb-3 mt-4"><strong>Service Client</strong></p>
                <p className="mb-2">📧 <strong>Support :</strong> support@zencall.ai</p>
              </div>
              <p className="mb-4">
                Nous nous engageons à vous répondre dans les meilleurs délais et à traiter votre demande avec la plus grande attention.
              </p>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <div className="bg-zencall-coral-50 border border-zencall-coral-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Engagement de JARVIS</h3>
                <p className="mb-4">
                  JARVIS s'engage à traiter vos données personnelles avec le plus grand soin et dans le respect le plus strict de la réglementation en vigueur. La protection de votre vie privée et la sécurité de vos données sont au cœur de nos préoccupations.
                </p>
                <p className="mb-0">
                  Nous restons à votre disposition pour toute question ou préoccupation concernant vos données personnelles.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
