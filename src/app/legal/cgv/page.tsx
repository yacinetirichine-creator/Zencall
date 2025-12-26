import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGV - Conditions Générales de Vente | Zencall",
  description: "Conditions Générales de Vente de la plateforme Zencall",
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Conditions Générales de Vente
          </h1>
          
          <div className="text-sm text-gray-600 mb-8">
            <p>Dernière mise à jour : 26 décembre 2025</p>
            <p className="mt-2">Version : 1.0</p>
          </div>

          <div className="prose max-w-none">
            {/* PRÉAMBULE */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Préambule</h2>
              
              <p className="mb-4">
                Les présentes Conditions Générales de Vente (ci-après "CGV") régissent exclusivement les relations 
                commerciales entre la société JARVIS et ses Clients dans le cadre de la vente de Services par 
                abonnement sur la plateforme Zencall.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Vendeur :</h3>
                <ul className="list-none space-y-1 text-sm">
                  <li><strong>Raison sociale :</strong> JARVIS</li>
                  <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
                  <li><strong>Capital social :</strong> [À compléter selon KBIS]</li>
                  <li><strong>Siège social :</strong> [À compléter selon KBIS]</li>
                  <li><strong>RCS :</strong> [Numéro selon KBIS]</li>
                  <li><strong>SIRET :</strong> [Numéro selon KBIS]</li>
                  <li><strong>N° TVA intracommunautaire :</strong> [À compléter]</li>
                  <li><strong>Email :</strong> billing@zencall.ai</li>
                </ul>
              </div>

              <p className="mb-4 font-bold text-gray-900">
                ⚖️ OPPOSABILITÉ : Toute commande implique l'acceptation sans réserve des présentes CGV, qui prévalent 
                sur tout autre document du Client (bons de commande, CGU internes, etc.), sauf accord écrit préalable.
              </p>
            </section>

            {/* ARTICLE 1 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 1 - Objet</h2>
              
              <p className="mb-4">
                Les présentes CGV définissent les conditions dans lesquelles JARVIS commercialise par abonnement 
                l'accès à la plateforme Zencall et ses Services associés (ci-après "les Services") :
              </p>

              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Starter</strong> : Forfait d'entrée de gamme (minutes limitées, fonctionnalités de base)</li>
                <li><strong>Pro</strong> : Forfait intermédiaire (plus de minutes, API REST, webhooks)</li>
                <li><strong>Business</strong> : Forfait avancé (campagnes, support prioritaire)</li>
                <li><strong>Agency</strong> : Forfait premium (minutes illimitées, SLA garanti, support dédié 24/7)</li>
              </ul>

              <p className="mb-4">
                Chaque forfait inclut un quota mensuel de minutes d'appel. Les minutes supplémentaires sont facturées 
                selon la grille tarifaire en vigueur (consultable sur la page Prix).
              </p>
            </section>

            {/* ARTICLE 2 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 2 - Prix</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">2.1 Tarification</h3>
              <p className="mb-4">
                Les prix sont indiqués en euros (€), livres sterling (£), réals brésiliens (R$), roupies indiennes (₹), 
                yuan chinois (¥) selon le pays de facturation, <strong>HORS TAXES</strong> pour les professionnels 
                assujettis à la TVA et <strong>TTC</strong> pour les consommateurs.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-bold text-yellow-900 mb-2">💰 CLAUSE TARIFAIRE :</p>
                <p className="text-sm">
                  Les prix affichés sur le site au moment de la commande sont contractuels pour la période d'abonnement 
                  en cours. JARVIS se réserve le droit de modifier ses tarifs à tout moment, avec notification 30 jours 
                  avant application aux abonnements existants. Le Client pourra résilier sans frais avant la date d'effet.
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">2.2 TVA</h3>
              <p className="mb-4">
                La TVA applicable est celle en vigueur dans le pays de facturation du Client :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>France : 20%</li>
                <li>Espagne : 21%</li>
                <li>Allemagne : 19%</li>
                <li>Pays-Bas : 21%</li>
                <li>UK : 20%</li>
                <li>Autres pays UE : taux local applicable</li>
              </ul>

              <p className="mb-4">
                Les professionnels justifiant d'un numéro de TVA intracommunautaire valide bénéficient de 
                l'autoliquidation (facture HT). En cas de numéro invalide, la TVA française s'applique.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">2.3 Facturation Supplémentaire</h3>
              <p className="mb-4">
                Les dépassements du quota mensuel de minutes sont facturés le mois suivant selon les tarifs en vigueur :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
                <li>Starter : 0,09 €/min supplémentaire (FR), prix variables selon pays</li>
                <li>Pro : 0,08 €/min supplémentaire</li>
                <li>Business : 0,07 €/min supplémentaire</li>
                <li>Agency : 0,06 €/min supplémentaire</li>
              </ul>
            </section>

            {/* ARTICLE 3 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 3 - Commande et Souscription</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">3.1 Processus de Commande</h3>
              <p className="mb-4">
                La souscription s'effectue en ligne sur zencall.ai selon le processus suivant :
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Sélection du forfait</li>
                <li>Création du compte utilisateur</li>
                <li>Saisie des informations de facturation</li>
                <li>Saisie des informations de paiement (carte bancaire)</li>
                <li>Acceptation des CGU, CGV et Politique de Confidentialité (obligatoire)</li>
                <li>Validation de la commande</li>
                <li>Paiement immédiat du premier mois</li>
                <li>Email de confirmation + accès instantané</li>
              </ol>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900 mb-2">✅ VALIDATION :</p>
                <p className="text-sm">
                  La validation de la commande par le Client constitue une acceptation irrévocable et forme le contrat. 
                  Un email de confirmation récapitulant la commande est immédiatement envoyé. Le Client doit vérifier 
                  l'exactitude des informations et signaler toute erreur sous 48h.
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">3.2 Essai Gratuit</h3>
              <p className="mb-4">
                Certains forfaits peuvent inclure une période d'essai gratuit de 14 jours. Durant cette période :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Aucun paiement n'est effectué</li>
                <li>Le Client peut annuler à tout moment sans frais</li>
                <li>À l'issue des 14 jours, facturation automatique sauf résiliation</li>
                <li>Limité à un essai par Client (même adresse email/carte bancaire)</li>
              </ul>

              <p className="mb-4 font-bold text-red-700">
                ⚠️ ABUS : Toute tentative de contournement (comptes multiples, cartes virtuelles) entraînera le 
                blocage définitif et la facturation rétroactive au tarif plein.
              </p>
            </section>

            {/* ARTICLE 4 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 4 - Modalités de Paiement</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.1 Moyens de Paiement</h3>
              <p className="mb-4">
                Les paiements s'effectuent exclusivement par :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Carte bancaire (Visa, Mastercard, American Express)</li>
                <li>Virement SEPA (pour forfaits {'>'} 500 €/mois, sur demande)</li>
              </ul>

              <p className="mb-4">
                Les paiements sont traités par <strong>Stripe</strong>, prestataire certifié PCI-DSS niveau 1. 
                JARVIS ne conserve aucune donnée bancaire.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.2 Prélèvement Automatique</h3>
              <p className="mb-4">
                En souscrivant un abonnement, le Client autorise JARVIS à prélever automatiquement :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Le montant de l'abonnement mensuel à date anniversaire</li>
                <li>Les éventuels dépassements de quota du mois écoulé</li>
                <li>Les frais supplémentaires liés aux services optionnels activés</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-bold text-red-900 mb-2">💳 DÉFAUT DE PAIEMENT :</p>
                <p className="text-sm mb-2">
                  En cas de rejet de paiement :
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Notification immédiate par email</li>
                  <li>3 tentatives de prélèvement sur 10 jours</li>
                  <li>Suspension du compte après 10 jours d'impayé</li>
                  <li>Résiliation automatique après 30 jours</li>
                  <li>Frais de rejet bancaire : 15 € HT par transaction</li>
                  <li>Majoration de retard : 10% du montant dû</li>
                  <li>Indemnité forfaitaire de recouvrement : 40 € (Art. D. 441-5 C. com.)</li>
                </ul>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">4.3 Facturation</h3>
              <p className="mb-4">
                Les factures sont :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Générées automatiquement en début de mois (paiement mensuel)</li>
                <li>Envoyées par email à l'adresse de facturation indiquée</li>
                <li>Téléchargeables à tout moment depuis l'espace client</li>
                <li>Conformes aux exigences fiscales françaises et européennes</li>
              </ul>

              <p className="mb-4 font-bold text-gray-900">
                Le Client doit signaler toute erreur de facturation dans les 30 jours suivant l'émission.
              </p>
            </section>

            {/* ARTICLE 5 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 5 - Droit de Rétractation</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">5.1 Consommateurs</h3>
              <p className="mb-4">
                Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose 
                d'un délai de <strong>14 jours francs</strong> pour exercer son droit de rétractation sans avoir à 
                justifier de motif ni à payer de pénalité.
              </p>

              <p className="mb-4">
                Le délai court à compter du jour de la souscription de l'abonnement.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-bold text-yellow-900 mb-2">⚠️ RENONCIATION AU DROIT DE RÉTRACTATION :</p>
                <p className="text-sm">
                  Conformément à l'article L221-28 du Code de la consommation, le consommateur qui demande l'exécution 
                  immédiate du service (activation instantanée du compte) renonce expressément à son droit de 
                  rétractation dès utilisation effective de la Plateforme. En cas de rétractation avant toute utilisation, 
                  remboursement intégral sous 14 jours.
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">5.2 Professionnels</h3>
              <p className="mb-4">
                Les professionnels (commerçants, artisans, professions libérales, sociétés) ne bénéficient pas du 
                droit de rétractation conformément à l'article L221-3 du Code de la consommation.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">5.3 Modalités d'Exercice</h3>
              <p className="mb-4">
                Pour exercer le droit de rétractation, le consommateur doit notifier sa décision par :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Email à : billing@zencall.ai</li>
                <li>Courrier recommandé à : JARVIS - Service Facturation - [Adresse KBIS]</li>
              </ul>

              <p className="mb-4">
                Modèle de formulaire de rétractation (facultatif) :
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm mb-4">
                <p className="mb-2">À l'attention de JARVIS :</p>
                <p className="mb-2">
                  Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services 
                  ci-dessous :
                </p>
                <ul className="list-none space-y-1 ml-4">
                  <li>- Commandé le : [Date]</li>
                  <li>- Numéro de commande : [N°]</li>
                  <li>- Nom du consommateur : [Nom]</li>
                  <li>- Adresse du consommateur : [Adresse]</li>
                  <li>- Date : [Date]</li>
                  <li>- Signature (si notification papier) :</li>
                </ul>
              </div>
            </section>

            {/* ARTICLE 6 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 6 - Durée et Renouvellement</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">6.1 Durée de l'Abonnement</h3>
              <p className="mb-4">
                Les abonnements sont souscrits pour une durée initiale d'<strong>un (1) mois</strong>, 
                renouvelable tacitement par périodes successives d'un mois.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">6.2 Renouvellement Automatique</h3>
              <p className="mb-4">
                Sauf résiliation par le Client au moins 48 heures avant la date d'échéance, l'abonnement est 
                automatiquement renouvelé et facturé pour un mois supplémentaire.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900 mb-2">📧 RAPPEL DE RENOUVELLEMENT :</p>
                <p className="text-sm">
                  Le Client reçoit un email de rappel 7 jours avant chaque échéance mentionnant le montant qui sera 
                  prélevé et le lien pour gérer son abonnement.
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">6.3 Résiliation</h3>
              <p className="mb-4">
                Le Client peut résilier son abonnement à tout moment depuis son espace client (section Facturation {'>'}
                Gérer l'abonnement {'>'} Résilier). La résiliation prend effet à la fin de la période en cours. 
                Aucun remboursement prorata temporis n'est effectué.
              </p>

              <p className="mb-4 font-bold text-red-700">
                ⚠️ AUCUN REMBOURSEMENT : Les sommes déjà versées restent acquises à JARVIS, sauf exercice du droit 
                de rétractation ou manquement grave de JARVIS à ses obligations.
              </p>
            </section>

            {/* ARTICLE 7 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 7 - Garanties et Support</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">7.1 Garantie de Disponibilité</h3>
              <p className="mb-4">
                JARVIS s'engage à fournir un service disponible à <strong>99,5%</strong> sur base mensuelle, 
                hors maintenance programmée (notifiée 48h à l'avance).
              </p>

              <p className="mb-4">
                Calcul du taux de disponibilité : (Temps total - Temps d'indisponibilité) / Temps total × 100
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">7.2 Support Technique</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Starter/Pro :</strong> Support email (délai de réponse : 48h ouvrées)</li>
                <li><strong>Business :</strong> Support email prioritaire (délai : 24h ouvrées)</li>
                <li><strong>Agency :</strong> Support dédié 24/7 par email/téléphone/chat (délai : 4h, 24/7)</li>
              </ul>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">7.3 SLA (Service Level Agreement)</h3>
              <p className="mb-4">
                Pour le forfait <strong>Agency uniquement</strong> :
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Disponibilité garantie : 99,9%</li>
                <li>Temps de rétablissement maximal (incident majeur) : 4 heures</li>
                <li>Compensation en cas de non-respect : 10% de réduction sur le mois concerné par tranche de 0,1% manquante</li>
              </ul>

              <p className="mb-4 font-bold text-gray-900">
                Pour bénéficier de la compensation SLA, le Client doit en faire la demande par écrit dans les 15 jours 
                suivant la fin du mois concerné, en fournissant les logs/preuves de l'indisponibilité.
              </p>
            </section>

            {/* ARTICLE 8 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 8 - Responsabilité</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="font-bold text-yellow-900 mb-2">⚠️ LIMITATION DE RESPONSABILITÉ :</p>
                <p className="text-sm mb-2">
                  La responsabilité de JARVIS est limitée aux dommages directs et prévisibles. En aucun cas JARVIS 
                  ne pourra être tenue responsable :
                </p>
                <ul className="list-disc pl-6 text-sm space-y-2">
                  <li>Des dommages indirects (perte de CA, de clientèle, d'opportunité, de données, etc.)</li>
                  <li>De l'usage illicite ou non conforme des Services par le Client</li>
                  <li>Des interruptions liées à la force majeure ou aux fournisseurs tiers</li>
                  <li>De l'inexactitude des contenus générés par l'IA</li>
                  <li>Des violations par le Client de réglementations (RGPD, BLOCTEL, etc.)</li>
                </ul>
                <p className="text-sm mt-2 font-bold">
                  PLAFONNEMENT : Responsabilité totale limitée au montant payé par le Client sur les 12 derniers mois, 
                  avec maximum de 10 000 €.
                </p>
              </div>
            </section>

            {/* ARTICLE 9 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 9 - Force Majeure</h2>
              
              <p className="mb-4">
                JARVIS ne pourra être tenue responsable de l'inexécution de ses obligations en cas de force majeure 
                (catastrophe naturelle, guerre, grève générale, cyberattaque massive, panne réseau Internet, 
                défaillance AWS/Stripe/Twilio, etc.).
              </p>

              <p className="mb-4">
                En cas de force majeure {'>'} 30 jours consécutifs, résiliation possible par l'une ou l'autre partie, 
                sans indemnité, avec remboursement prorata temporis de la période non utilisée.
              </p>
            </section>

            {/* ARTICLE 10 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 10 - Médiation et Litiges</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.1 Médiation Consommateurs</h3>
              <p className="mb-4">
                Conformément à l'article L612-1 du Code de la consommation, le consommateur a le droit de recourir 
                gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
                <p className="font-bold mb-2">Médiateur de la consommation compétent :</p>
                <ul className="list-none space-y-1">
                  <li><strong>Nom :</strong> [À désigner - ex: CM2C, MEDICYS, etc.]</li>
                  <li><strong>Site web :</strong> [URL]</li>
                  <li><strong>Email :</strong> [Email]</li>
                  <li><strong>Adresse :</strong> [Adresse]</li>
                </ul>
                <p className="mt-2">
                  Plateforme européenne de résolution en ligne des litiges :{" "}
                  <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
              </div>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.2 Droit Applicable</h3>
              <p className="mb-4">
                Les présentes CGV sont soumises au <strong>droit français</strong>.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">10.3 Juridiction Compétente</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="font-bold text-blue-900 mb-2">⚖️ COMPÉTENCE :</p>
                <p className="text-sm">
                  Tout litige sera soumis à la compétence exclusive des tribunaux du ressort de [VILLE SIÈGE SOCIAL], 
                  sauf pour les consommateurs qui peuvent saisir le tribunal de leur domicile ou du lieu de livraison 
                  du bien/prestation du service.
                </p>
              </div>
            </section>

            {/* ARTICLE 11 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Article 11 - Dispositions Finales</h2>
              
              <h3 className="font-bold text-gray-900 mt-4 mb-2">11.1 Modification des CGV</h3>
              <p className="mb-4">
                JARVIS se réserve le droit de modifier les CGV à tout moment. Les modifications s'appliquent aux 
                nouveaux abonnements immédiatement et aux abonnements en cours après notification 30 jours à l'avance.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">11.2 Intégralité</h3>
              <p className="mb-4">
                Les CGV, conjointement avec les CGU et la Politique de Confidentialité, constituent l'intégralité 
                de l'accord commercial.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">11.3 Conservation</h3>
              <p className="mb-4">
                Conformément à l'article 1127-1 du Code civil et à l'article L213-1 du Code de la consommation, 
                JARVIS archivera les CGV acceptées sur support fiable et durable pendant 10 ans.
              </p>
            </section>

            {/* CONTACT */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="mb-2">Pour toute question relative aux CGV ou à la facturation :</p>
                <ul className="list-none space-y-2 text-sm">
                  <li><strong>Email :</strong> billing@zencall.ai</li>
                  <li><strong>Téléphone :</strong> [À compléter]</li>
                  <li><strong>Adresse postale :</strong> JARVIS - Service Facturation<br/>[Adresse selon KBIS]</li>
                </ul>
              </div>
            </section>

            {/* SIGNATURE */}
            <div className="border-t-2 border-gray-300 mt-12 pt-6">
              <p className="text-sm text-gray-600 text-center">
                En validant votre commande, vous reconnaissez avoir lu, compris et accepté sans réserve 
                les présentes Conditions Générales de Vente.
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
