import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGU - Conditions Générales d'Utilisation | Zencall",
  description: "Conditions Générales d'Utilisation de la plateforme Zencall",
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Conditions Générales d'Utilisation
          </h1>
          
          <div className="text-sm text-gray-600 mb-8">
            <p>Dernière mise à jour : 26 décembre 2025</p>
            <p className="mt-2">Version : 1.0</p>
          </div>

          <div className="prose max-w-none">
            {/* ARTICLE 1 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 1 - Objet et Champ d'Application</h2>
              
              <p className="mb-4">
                Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation 
                de la plateforme Zencall (ci-après "la Plateforme"), éditée par la société JARVIS.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Éditeur de la Plateforme :</h3>
                <ul className="list-none space-y-1 text-sm">
                  <li><strong>Raison sociale :</strong> JARVIS</li>
                  <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
                  <li><strong>Capital social :</strong> [À compléter selon KBIS]</li>
                  <li><strong>Siège social :</strong> [À compléter selon KBIS]</li>
                  <li><strong>RCS :</strong> [Numéro selon KBIS]</li>
                  <li><strong>SIRET :</strong> [Numéro selon KBIS]</li>
                  <li><strong>N° TVA intracommunautaire :</strong> [À compléter]</li>
                  <li><strong>Directeur de publication :</strong> [Représentant légal]</li>
                  <li><strong>Contact :</strong> contact@zen-call.net</li>
                </ul>
              </div>

              <p className="mb-4">
                L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. 
                Toute inscription ou utilisation de la Plateforme vaut acceptation sans réserve des CGU.
              </p>

              <p className="mb-4 font-bold text-gray-900">
                ⚠️ CLAUSE IMPORTANTE : L'acceptation des CGU est OBLIGATOIRE et IRRÉVOCABLE pour utiliser nos services.
              </p>
            </section>

            {/* ARTICLE 2 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 2 - Définitions</h2>
              
              <dl className="space-y-3">
                <div>
                  <dt className="font-bold text-gray-900">Client :</dt>
                  <dd>Toute personne physique ou morale ayant souscrit à un abonnement payant sur la Plateforme.</dd>
                </div>
                <div>
                  <dt className="font-bold text-gray-900">Utilisateur :</dt>
                  <dd>Toute personne accédant à la Plateforme, qu'elle soit cliente ou non.</dd>
                </div>
                <div>
                  <dt className="font-bold text-gray-900">Services :</dt>
                  <dd>L'ensemble des fonctionnalités offertes par la Plateforme, incluant notamment l'intelligence artificielle conversationnelle, la gestion des appels téléphoniques, la prise de rendez-vous automatisée, et tous services connexes.</dd>
                </div>
                <div>
                  <dt className="font-bold text-gray-900">Assistant IA :</dt>
                  <dd>Agent conversationnel intelligent capable de gérer des appels téléphoniques de manière autonome.</dd>
                </div>
                <div>
                  <dt className="font-bold text-gray-900">Données Personnelles :</dt>
                  <dd>Toute information se rapportant à une personne physique identifiée ou identifiable au sens du RGPD.</dd>
                </div>
              </dl>
            </section>

            {/* ARTICLE 3 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 3 - Inscription et Compte Utilisateur</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">3.1 Conditions d'Inscription</h3>
              <p className="mb-4">
                L'inscription sur la Plateforme est réservée :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Aux personnes physiques majeures disposant de la pleine capacité juridique</li>
                <li>Aux personnes morales dûment immatriculées et représentées par leur représentant légal</li>
                <li>Aux professionnels agissant dans le cadre de leur activité professionnelle</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-bold text-red-900">🚫 CLAUSE D'EXCLUSION :</p>
                <p className="text-sm mt-2">
                  Est strictement interdite toute inscription par une personne mineure, une personne frappée 
                  d'incapacité, ou toute entité non immatriculée. JARVIS se réserve le droit de suspendre ou 
                  résilier immédiatement tout compte ne respectant pas ces conditions, sans préavis ni indemnité.
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">3.2 Exactitude des Informations</h3>
              <p className="mb-4">
                L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription 
                et à les mettre à jour en cas de modification. Toute fausse déclaration ou omission volontaire pourra 
                entraîner la suspension ou la résiliation immédiate du compte, sans préjudice de dommages et intérêts.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">3.3 Sécurité du Compte</h3>
              <p className="mb-4">
                L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. 
                Il s'engage à :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Choisir un mot de passe robuste (minimum 12 caractères, majuscules, minuscules, chiffres, caractères spéciaux)</li>
                <li>Ne pas communiquer ses identifiants à des tiers</li>
                <li>Informer immédiatement JARVIS de toute utilisation non autorisée de son compte</li>
                <li>Se déconnecter systématiquement après chaque session sur un appareil partagé</li>
              </ul>

              <p className="mb-4 font-bold text-gray-900">
                ⚖️ CLAUSE DE RESPONSABILITÉ : L'Utilisateur est entièrement responsable de toute activité effectuée 
                depuis son compte, qu'elle soit autorisée ou non. JARVIS ne pourra être tenue responsable en cas 
                d'utilisation frauduleuse résultant d'un manquement de l'Utilisateur à ses obligations de sécurité.
              </p>
            </section>

            {/* ARTICLE 4 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 4 - Description des Services</h2>
              
              <p className="mb-4">
                La Plateforme Zencall propose les services suivants :
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.1 Intelligence Artificielle Conversationnelle</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Réception et traitement automatique des appels téléphoniques 24/7</li>
                <li>Qualification intelligente des appelants</li>
                <li>Réponses personnalisées selon les scénarios configurés</li>
                <li>Voix ultra-réaliste en synthèse vocale</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.2 Gestion des Rendez-vous</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Prise de rendez-vous automatisée</li>
                <li>Synchronisation calendrier</li>
                <li>Rappels automatiques</li>
                <li>Gestion des annulations et reports</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.3 Campagnes d'Appels Sortants</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Diffusion de messages vocaux automatisés</li>
                <li>Gestion de listes de contacts</li>
                <li>Statistiques et rapports détaillés</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.4 Intégrations API</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>API REST complète</li>
                <li>Webhooks en temps réel</li>
                <li>Intégrations CRM tierces</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-bold text-yellow-900">⚠️ CLAUSE DE DISPONIBILITÉ :</p>
                <p className="text-sm mt-2">
                  JARVIS s'engage à fournir un service avec un taux de disponibilité de 99,5% sur une base mensuelle, 
                  hors maintenance programmée notifiée 48h à l'avance. Les périodes de maintenance ne sont pas décomptées 
                  du calcul de disponibilité. Aucune garantie absolue de disponibilité 100% ne peut être donnée en raison 
                  de la nature d'Internet et des services tiers (téléphonie, cloud, etc.).
                </p>
              </div>
            </section>

            {/* ARTICLE 5 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 5 - Obligations de l'Utilisateur</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">5.1 Usage Conforme</h3>
              <p className="mb-4">L'Utilisateur s'engage à utiliser la Plateforme de manière conforme :</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Aux présentes CGU et à toute réglementation applicable</li>
                <li>Aux bonnes mœurs et à l'ordre public</li>
                <li>Aux droits des tiers (propriété intellectuelle, vie privée, etc.)</li>
                <li>Aux réglementations sur la protection des données (RGPD)</li>
                <li>Aux réglementations sur le démarchage téléphonique et BLOCTEL</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">5.2 Usages Strictement Interdits</h3>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-bold text-red-900 mb-2">🚫 INTERDICTIONS FORMELLES :</p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Utiliser la Plateforme à des fins illégales, frauduleuses ou malveillantes</li>
                  <li>Harceler, menacer, diffamer ou porter atteinte à autrui</li>
                  <li>Diffuser des contenus à caractère pornographique, pédophile, violent, raciste, xénophobe ou incitant à la haine</li>
                  <li>Contourner les mesures de sécurité ou tenter d'accéder à des zones restreintes</li>
                  <li>Effectuer du reverse engineering, décompiler ou désassembler la Plateforme</li>
                  <li>Utiliser des robots, scrapers ou tout moyen automatisé non autorisé</li>
                  <li>Surcharger intentionnellement l'infrastructure (attaques DDoS, spam)</li>
                  <li>Revendre, céder ou transférer son accès à des tiers sans autorisation écrite</li>
                  <li>Utiliser la Plateforme pour du démarchage téléphonique non conforme à BLOCTEL</li>
                  <li>Collecter des données personnelles sans consentement explicite</li>
                  <li>Imiter, usurper l'identité d'une personne ou entité</li>
                  <li>Diffuser des virus, malwares ou tout code malveillant</li>
                </ul>
              </div>

              <p className="mb-4 font-bold text-gray-900">
                ⚖️ SANCTIONS : Toute violation de ces interdictions entraînera la suspension immédiate du compte, 
                la résiliation du contrat sans préavis ni remboursement, et pourra donner lieu à des poursuites 
                judiciaires civiles et/ou pénales. JARVIS se réserve le droit de réclamer des dommages et intérêts.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">5.3 Conformité RGPD et Prospection</h3>
              <p className="mb-4">
                L'Utilisateur s'engage expressément à :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Obtenir le consentement préalable des personnes avant tout appel à caractère commercial</li>
                <li>Respecter scrupuleusement le registre d'opposition BLOCTEL</li>
                <li>Informer les appelants de leurs droits (accès, rectification, suppression, opposition)</li>
                <li>Ne contacter que des personnes ayant donné leur consentement explicite (opt-in)</li>
                <li>Tenir un registre des traitements de données conformément au RGPD</li>
                <li>Respecter les horaires légaux d'appel (8h-20h en semaine, interdiction dimanche/jours fériés sauf accord)</li>
              </ul>

              <p className="mb-4 font-bold text-red-700">
                ⚠️ RESPONSABILITÉ EXCLUSIVE : L'Utilisateur est SEUL responsable de la conformité légale de ses 
                campagnes d'appels. JARVIS ne pourra en aucun cas être tenue responsable des manquements de 
                l'Utilisateur aux obligations RGPD, BLOCTEL ou toute autre réglementation applicable.
              </p>
            </section>

            {/* ARTICLE 6 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 6 - Propriété Intellectuelle</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">6.1 Droits de JARVIS</h3>
              <p className="mb-4">
                L'intégralité de la Plateforme Zencall (code source, interface graphique, design, logos, marques, 
                bases de données, contenus, algorithmes, etc.) est la propriété exclusive de JARVIS ou de ses 
                concédants de licence.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900 mb-2">© PROTECTION ABSOLUE :</p>
                <p className="text-sm">
                  Toute reproduction, représentation, modification, adaptation, traduction, arrangement, ou exploitation, 
                  totale ou partielle, de la Plateforme, par quelque procédé que ce soit, sans autorisation écrite 
                  préalable de JARVIS, est strictement interdite et constitue une contrefaçon sanctionnée par les 
                  articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">6.2 Licence d'Utilisation</h3>
              <p className="mb-4">
                JARVIS concède à l'Utilisateur une licence d'utilisation :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Non exclusive</strong> : JARVIS peut concéder des licences à d'autres utilisateurs</li>
                <li><strong>Non transférable</strong> : L'Utilisateur ne peut céder cette licence sans accord écrit</li>
                <li><strong>Révocable</strong> : En cas de résiliation du contrat ou violation des CGU</li>
                <li><strong>Limitée</strong> : Uniquement pour l'usage professionnel prévu par l'abonnement</li>
                <li><strong>Mondiale</strong> : Utilisable depuis tout pays où les Services sont disponibles</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">6.3 Contenus de l'Utilisateur</h3>
              <p className="mb-4">
                L'Utilisateur conserve l'intégralité de ses droits sur les contenus qu'il crée ou importe sur la 
                Plateforme (scripts d'appels, listes de contacts, enregistrements, etc.).
              </p>
              <p className="mb-4">
                Toutefois, l'Utilisateur concède à JARVIS une licence mondiale, gratuite, non exclusive pour :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Héberger, stocker et traiter les contenus</li>
                <li>Effectuer les opérations techniques nécessaires au bon fonctionnement des Services</li>
                <li>Réaliser des sauvegardes et copies de sécurité</li>
                <li>Améliorer les algorithmes d'IA (de manière anonymisée)</li>
              </ul>

              <p className="mb-4 font-bold text-gray-900">
                🔒 CLAUSE DE CONFIDENTIALITÉ : JARVIS s'engage à ne jamais communiquer, vendre ou exploiter 
                commercialement les contenus des Utilisateurs à des tiers, sauf obligation légale ou consentement explicite.
              </p>
            </section>

            {/* ARTICLE 7 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 7 - Protection des Données Personnelles</h2>
              
              <p className="mb-4">
                Le traitement des données personnelles est détaillé dans notre{" "}
                <a href="/legal/privacy" className="text-blue-600 hover:underline">Politique de Confidentialité</a>.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">7.1 Responsable de Traitement</h3>
              <p className="mb-4">
                JARVIS agit en tant que responsable de traitement pour les données personnelles des Utilisateurs 
                (comptes, facturation, logs de connexion).
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">7.2 Sous-traitant</h3>
              <p className="mb-4">
                Pour les données des appelants/contacts des Clients, JARVIS agit en qualité de sous-traitant. 
                Le Client demeure responsable de traitement et doit garantir la licéité des traitements.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900 mb-2">🔐 ENGAGEMENT RGPD :</p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Chiffrement AES-256 des données sensibles au repos et en transit (TLS 1.3)</li>
                  <li>Hébergement des données en Union Européenne (conformité RGPD)</li>
                  <li>Pseudonymisation et minimisation des données collectées</li>
                  <li>Durée de conservation limitée (24 mois max sauf obligation légale)</li>
                  <li>Droit d'accès, rectification, suppression, portabilité, opposition</li>
                  <li>Notification sous 72h en cas de violation de données</li>
                  <li>DPO joignable à dpo@zen-call.net</li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 8 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 8 - Responsabilité et Garanties</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">8.1 Limitation de Responsabilité</h3>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-bold text-yellow-900 mb-2">⚠️ CLAUSE LIMITATIVE ESSENTIELLE :</p>
                <p className="text-sm mb-2">
                  Dans les limites autorisées par la loi, JARVIS ne pourra être tenue responsable :
                </p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs</li>
                  <li>De la perte de profits, revenus, données, opportunités commerciales ou clientèle</li>
                  <li>Des interruptions de service dues à des cas de force majeure</li>
                  <li>Des actes ou omissions de tiers (hébergeurs, opérateurs télécom, fournisseurs API)</li>
                  <li>De l'usage illicite ou non conforme de la Plateforme par l'Utilisateur</li>
                  <li>Des contenus générés par l'IA (exactitude, pertinence, conformité)</li>
                  <li>Des dysfonctionnements liés à l'équipement de l'Utilisateur</li>
                  <li>Des violations de sécurité résultant d'une faute de l'Utilisateur</li>
                </ul>
              </div>

              <p className="mb-4 font-bold text-gray-900">
                💰 PLAFONNEMENT : En tout état de cause, la responsabilité totale de JARVIS, tous dommages confondus, 
                ne pourra excéder le montant des sommes effectivement payées par l'Utilisateur au cours des 12 mois 
                précédant la survenance du dommage, avec un plafond maximum de 10 000 € (dix mille euros).
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">8.2 Exclusions de Garantie</h3>
              <p className="mb-4">
                Les Services sont fournis "en l'état" et "selon disponibilité". JARVIS ne garantit pas :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>L'absence totale d'erreurs, bugs ou interruptions</li>
                <li>La compatibilité avec tous les systèmes et navigateurs</li>
                <li>L'exactitude absolue des transcriptions et réponses de l'IA</li>
                <li>L'atteinte de résultats commerciaux spécifiques</li>
                <li>La protection contre toutes cyberattaques</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">8.3 Indemnisation</h3>
              <p className="mb-4">
                L'Utilisateur s'engage à indemniser, défendre et garantir JARVIS contre toute réclamation, action, 
                perte, dommage, responsabilité, coût ou dépense (incluant les frais d'avocat) résultant :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>De sa violation des présentes CGU</li>
                <li>De son utilisation illégale ou non autorisée de la Plateforme</li>
                <li>De sa violation des droits de tiers</li>
                <li>De ses contenus (diffamation, atteinte à la vie privée, etc.)</li>
                <li>De sa non-conformité RGPD ou BLOCTEL</li>
              </ul>
            </section>

            {/* ARTICLE 9 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 9 - Force Majeure</h2>
              
              <p className="mb-4">
                JARVIS ne pourra être tenue responsable de tout retard ou inexécution de ses obligations résultant 
                d'un cas de force majeure au sens de l'article 1218 du Code civil et de la jurisprudence française.
              </p>

              <p className="mb-4">Sont notamment considérés comme cas de force majeure :</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Catastrophes naturelles (séismes, inondations, incendies)</li>
                <li>Guerres, attentats, émeutes, insurrections</li>
                <li>Grèves générales, lock-out</li>
                <li>Pannes majeures d'Internet ou des réseaux de télécommunication</li>
                <li>Cyberattaques massives (DDoS, ransomware)</li>
                <li>Décisions gouvernementales (embargo, sanctions, réquisitions)</li>
                <li>Défaillance grave d'un fournisseur essentiel (AWS, Twilio, etc.)</li>
              </ul>

              <p className="mb-4">
                En cas de force majeure d'une durée supérieure à 30 jours, chaque partie pourra résilier le contrat 
                de plein droit, sans indemnité, par lettre recommandée avec accusé de réception.
              </p>
            </section>

            {/* ARTICLE 10 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 10 - Suspension et Résiliation</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.1 Suspension par JARVIS</h3>
              <p className="mb-4">
                JARVIS se réserve le droit de suspendre immédiatement et sans préavis l'accès à la Plateforme en cas de :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violation grave ou répétée des CGU</li>
                <li>Non-paiement des sommes dues (après 15 jours de retard)</li>
                <li>Utilisation frauduleuse ou illégale</li>
                <li>Menace pour la sécurité ou la stabilité de la Plateforme</li>
                <li>Comportement abusif envers le support technique</li>
                <li>Injonction d'une autorité judiciaire ou administrative</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.2 Résiliation par JARVIS</h3>
              <p className="mb-4">
                En cas de manquement grave aux CGU, JARVIS pourra résilier le contrat avec effet immédiat par 
                email avec accusé de réception, sans préavis ni indemnité, et sans remboursement des sommes déjà versées.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.3 Résiliation par l'Utilisateur</h3>
              <p className="mb-4">
                L'Utilisateur peut résilier son abonnement à tout moment depuis son espace client, avec effet à la 
                fin de la période d'abonnement en cours. Aucun remboursement prorata temporis ne sera effectué, 
                sauf dispositions impératives contraires du droit de la consommation (rétractation de 14 jours).
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.4 Conséquences de la Résiliation</h3>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-bold text-red-900 mb-2">🗑️ SUPPRESSION DES DONNÉES :</p>
                <p className="text-sm mb-2">
                  À la résiliation du contrat, pour quelque cause que ce soit :
                </p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>L'accès à la Plateforme est immédiatement révoqué</li>
                  <li>Les données de l'Utilisateur seront conservées 30 jours (récupération possible)</li>
                  <li>Après 30 jours, suppression définitive et irréversible de toutes les données</li>
                  <li>Facturation jusqu'à la date effective de résiliation</li>
                  <li>Obligation de régler toutes sommes dues</li>
                </ul>
                <p className="text-sm mt-2 font-bold">
                  ⚠️ AUCUNE RÉCUPÉRATION POSSIBLE après le délai de 30 jours. L'Utilisateur est responsable 
                  de l'export de ses données avant résiliation.
                </p>
              </div>
            </section>

            {/* ARTICLE 11 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 11 - Modification des CGU</h2>
              
              <p className="mb-4">
                JARVIS se réserve le droit de modifier à tout moment les présentes CGU. Les modifications entreront 
                en vigueur dès leur publication sur la Plateforme.
              </p>

              <p className="mb-4">
                Les Utilisateurs seront informés de toute modification substantielle par email au moins 30 jours 
                avant leur entrée en vigueur. La poursuite de l'utilisation de la Plateforme après cette date 
                vaudra acceptation des nouvelles CGU.
              </p>

              <p className="mb-4 font-bold text-gray-900">
                En cas de désaccord avec les nouvelles CGU, l'Utilisateur pourra résilier son abonnement avant 
                leur entrée en vigueur, sans pénalité.
              </p>
            </section>

            {/* ARTICLE 12 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 12 - Droit Applicable et Juridiction</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">12.1 Loi Applicable</h3>
              <p className="mb-4">
                Les présentes CGU sont soumises au <strong>droit français</strong>, à l'exclusion de toute autre législation.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">12.2 Médiation Préalable</h3>
              <p className="mb-4">
                En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. 
                Une médiation pourra être engagée auprès d'un médiateur agréé.
              </p>

              <p className="mb-4">
                Pour les consommateurs : possibilité de recourir à la plateforme européenne de règlement en ligne des litiges : 
                <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">12.3 Compétence Juridictionnelle</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900 mb-2">⚖️ CLAUSE ATTRIBUTIVE DE JURIDICTION :</p>
                <p className="text-sm">
                  À défaut de résolution amiable dans un délai de 60 jours, tout litige relatif à l'interprétation 
                  ou à l'exécution des présentes CGU sera soumis à la compétence EXCLUSIVE des tribunaux du ressort 
                  de [VILLE DU SIÈGE SOCIAL selon KBIS], même en cas de pluralité de défendeurs ou d'appel en garantie, 
                  pour toutes les procédures et tous les incidents.
                </p>
                <p className="text-sm mt-2">
                  <em>Exception : Pour les consommateurs résidant en France, application des règles de compétence 
                  territoriale du Code de la consommation (juridiction du domicile du consommateur).</em>
                </p>
              </div>
            </section>

            {/* ARTICLE 13 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 13 - Dispositions Diverses</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">13.1 Intégralité de l'Accord</h3>
              <p className="mb-4">
                Les présentes CGU, conjointement avec les CGV et la Politique de Confidentialité, constituent 
                l'intégralité de l'accord entre JARVIS et l'Utilisateur et remplacent tous accords antérieurs, 
                écrits ou oraux.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">13.2 Divisibilité</h3>
              <p className="mb-4">
                Si une ou plusieurs stipulations des présentes CGU sont tenues pour non valides ou déclarées telles 
                en application d'une loi, d'un règlement ou à la suite d'une décision de justice, les autres stipulations 
                garderont toute leur force et leur portée.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">13.3 Non-Renonciation</h3>
              <p className="mb-4">
                Le fait pour JARVIS de ne pas se prévaloir d'un manquement de l'Utilisateur à l'une quelconque des 
                obligations des présentes CGU ne saurait être interprété comme une renonciation à se prévaloir ultérieurement 
                de ce manquement.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">13.4 Cession</h3>
              <p className="mb-4">
                L'Utilisateur ne peut céder ou transférer ses droits ou obligations au titre des présentes CGU sans 
                le consentement écrit préalable de JARVIS. JARVIS peut librement céder le présent contrat en cas de 
                restructuration, fusion, acquisition ou cession d'activité.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">13.5 Langue du Contrat</h3>
              <p className="mb-4">
                Les présentes CGU sont rédigées en langue française. En cas de traduction, seule la version française 
                fait foi.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">13.6 Conservation et Archivage</h3>
              <p className="mb-4">
                Les CGU acceptées sont archivées par JARVIS sur un support fiable et durable pendant toute la durée 
                du contrat et 10 ans après sa fin, conformément aux obligations légales. L'Utilisateur peut demander 
                une copie à tout moment.
              </p>
            </section>

            {/* CONTACT */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="mb-2">Pour toute question relative aux CGU :</p>
                <ul className="list-none space-y-2 text-sm">
                  <li><strong>Email :</strong> legal@zen-call.net</li>
                  <li><strong>Téléphone :</strong> [À compléter]</li>
                  <li><strong>Adresse postale :</strong> JARVIS - Service Juridique<br/>[Adresse selon KBIS]</li>
                </ul>
              </div>
            </section>

            {/* SIGNATURE */}
            <div className="border-t-2 border-gray-300 mt-12 pt-6">
              <p className="text-sm text-gray-600 text-center">
                En utilisant la Plateforme Zencall, vous reconnaissez avoir lu, compris et accepté sans réserve 
                les présentes Conditions Générales d'Utilisation.
              </p>
              <p className="text-sm text-gray-600 text-center mt-4 font-bold">
                Document juridiquement contraignant - Conservation recommandée
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
