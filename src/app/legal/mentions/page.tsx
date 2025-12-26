import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Zencall",
  description: "Mentions légales de la plateforme Zencall",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Mentions Légales
          </h1>
          
          <div className="text-sm text-gray-600 mb-8">
            <p>Dernière mise à jour : 26 décembre 2025</p>
          </div>

          <div className="prose max-w-none space-y-8">
            {/* ÉDITEUR */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Éditeur du Site</h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-bold text-gray-900">Raison sociale :</dt>
                    <dd>JARVIS</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Forme juridique :</dt>
                    <dd>Société par Actions Simplifiée (SAS)</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Capital social :</dt>
                    <dd>[À compléter selon KBIS] €</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Siège social :</dt>
                    <dd>[À compléter selon KBIS]</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">RCS :</dt>
                    <dd>[Numéro d'immatriculation selon KBIS]</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">SIRET :</dt>
                    <dd>[Numéro SIRET selon KBIS]</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">N° TVA intracommunautaire :</dt>
                    <dd>[À compléter]</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Représentant légal :</dt>
                    <dd>[Nom du dirigeant selon KBIS]</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Email :</dt>
                    <dd><a href="mailto:contact@zencall.ai" className="text-blue-600 hover:underline">contact@zencall.ai</a></dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Téléphone :</dt>
                    <dd>[À compléter]</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* DIRECTEUR PUBLICATION */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Directeur de la Publication</h2>
              <p className="text-gray-700">
                Le directeur de la publication du site www.zencall.ai est <strong>[Nom du représentant légal]</strong>, 
                en qualité de représentant légal de la société JARVIS.
              </p>
            </section>

            {/* HÉBERGEMENT */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Application Web :</h3>
                  <dl className="space-y-1 text-sm ml-4">
                    <div>
                      <dt className="font-bold inline">Hébergeur :</dt>
                      <dd className="inline ml-2">Vercel Inc.</dd>
                    </div>
                    <div>
                      <dt className="font-bold inline">Adresse :</dt>
                      <dd className="inline ml-2">340 S Lemon Ave #4133, Walnut, CA 91789, USA</dd>
                    </div>
                    <div>
                      <dt className="font-bold inline">Site :</dt>
                      <dd className="inline ml-2">
                        <a href="https://vercel.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                          https://vercel.com
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Base de Données :</h3>
                  <dl className="space-y-1 text-sm ml-4">
                    <div>
                      <dt className="font-bold inline">Hébergeur :</dt>
                      <dd className="inline ml-2">Supabase Inc.</dd>
                    </div>
                    <div>
                      <dt className="font-bold inline">Région :</dt>
                      <dd className="inline ml-2">Europe (eu-central-1 - Frankfurt, Germany)</dd>
                    </div>
                    <div>
                      <dt className="font-bold inline">Site :</dt>
                      <dd className="inline ml-2">
                        <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                          https://supabase.com
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Infrastructure Téléphonie :</h3>
                  <dl className="space-y-1 text-sm ml-4">
                    <div>
                      <dt className="font-bold inline">Fournisseur :</dt>
                      <dd className="inline ml-2">Twilio Inc.</dd>
                    </div>
                    <div>
                      <dt className="font-bold inline">Adresse :</dt>
                      <dd className="inline ml-2">101 Spear Street, San Francisco, CA 94105, USA</dd>
                    </div>
                    <div>
                      <dt className="font-bold inline">Site :</dt>
                      <dd className="inline ml-2">
                        <a href="https://twilio.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                          https://twilio.com
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                ℹ️ Toutes les données personnelles sont hébergées au sein de l'Union Européenne conformément au RGPD.
              </p>
            </section>

            {/* PROPRIÉTÉ INTELLECTUELLE */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Propriété Intellectuelle</h2>
              
              <p className="mb-4">
                L'ensemble des éléments composant le site www.zencall.ai (structure, textes, graphismes, logos, 
                icônes, sons, logiciels, bases de données, etc.) sont la propriété exclusive de JARVIS ou de ses 
                partenaires, et sont protégés par les lois françaises et internationales relatives à la propriété 
                intellectuelle.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-bold text-red-900 mb-2">⚠️ PROTECTION :</p>
                <p className="text-sm">
                  Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des 
                  éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation 
                  écrite préalable de JARVIS, sauf dans les cas prévus par l'article L.122-5 du Code de la Propriété 
                  Intellectuelle.
                </p>
              </div>

              <p className="mb-4">
                Toute exploitation non autorisée du site ou de ses éléments sera considérée comme constitutive d'une 
                contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de 
                la Propriété Intellectuelle.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">Marques :</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>"Zencall" est une marque déposée par JARVIS</li>
                <li>Le logo Zencall est protégé</li>
                <li>Toute utilisation non autorisée est strictement interdite</li>
              </ul>
            </section>

            {/* PROTECTION DES DONNÉES */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Protection des Données Personnelles</h2>
              
              <p className="mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679) et à la 
                loi Informatique et Libertés n°78-17 du 6 janvier 1978 modifiée, vous disposez de droits sur 
                vos données personnelles.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h3 className="font-bold text-blue-900 mb-2">Responsable du traitement :</h3>
                <p className="text-sm mb-2">JARVIS - [Adresse selon KBIS]</p>
                
                <h3 className="font-bold text-blue-900 mb-2 mt-4">Délégué à la Protection des Données (DPO) :</h3>
                <p className="text-sm">
                  Email : <a href="mailto:dpo@zencall.ai" className="text-blue-600 hover:underline">dpo@zencall.ai</a>
                </p>
              </div>

              <p className="mb-4">
                Pour plus d'informations sur le traitement de vos données personnelles, veuillez consulter notre{" "}
                <a href="/legal/privacy" className="text-blue-600 hover:underline font-medium">
                  Politique de Confidentialité
                </a>.
              </p>

              <h3 className="font-bold text-gray-900 mt-4 mb-2">Vos droits :</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement ("droit à l'oubli")</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
                <li>Droit de retirer votre consentement</li>
                <li>Droit de définir des directives post-mortem</li>
              </ul>

              <p className="mt-4 text-sm">
                Pour exercer vos droits, contactez : <a href="mailto:dpo@zencall.ai" className="text-blue-600 hover:underline">dpo@zencall.ai</a>
              </p>

              <p className="mt-2 text-sm">
                Vous disposez également du droit d'introduire une réclamation auprès de la CNIL :{" "}
                <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener">
                  www.cnil.fr
                </a>
              </p>
            </section>

            {/* COOKIES */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Cookies</h2>
              
              <p className="mb-4">
                Le site www.zencall.ai utilise des cookies pour améliorer l'expérience utilisateur et analyser 
                l'audience du site.
              </p>

              <h3 className="font-bold text-gray-900 mb-2">Types de cookies utilisés :</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm mb-4">
                <li>
                  <strong>Cookies strictement nécessaires :</strong> Authentification, sécurité, préférences linguistiques 
                  (durée : session ou 1 an)
                </li>
                <li>
                  <strong>Cookies analytiques :</strong> Statistiques anonymisées de fréquentation (Google Analytics, 
                  Vercel Analytics)
                </li>
                <li>
                  <strong>Cookies fonctionnels :</strong> Mémorisation des préférences utilisateur (pays, devise)
                </li>
              </ul>

              <p className="mb-4">
                Vous pouvez gérer vos préférences de cookies via le bandeau qui s'affiche lors de votre première 
                visite, ou à tout moment via les paramètres de votre navigateur.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                <p className="font-bold mb-2">Configuration des navigateurs :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Chrome : Paramètres {'>'} Confidentialité et sécurité {'>'} Cookies</li>
                  <li>Firefox : Options {'>'} Vie privée et sécurité {'>'} Cookies</li>
                  <li>Safari : Préférences {'>'} Confidentialité</li>
                  <li>Edge : Paramètres {'>'} Cookies et autorisations de site</li>
                </ul>
              </div>
            </section>

            {/* RESPONSABILITÉ */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Limitation de Responsabilité</h2>
              
              <p className="mb-4">
                JARVIS met tout en œuvre pour offrir aux utilisateurs des informations et services disponibles et 
                vérifiés, mais ne saurait être tenue responsable :
              </p>

              <ul className="list-disc pl-6 space-y-2 text-sm mb-4">
                <li>Des erreurs, omissions ou résultats qui pourraient être obtenus par l'usage des services</li>
                <li>De tout dommage direct ou indirect résultant de l'utilisation du site</li>
                <li>De l'interruption temporaire ou définitive des services pour maintenance ou cas de force majeure</li>
                <li>Des dysfonctionnements liés aux fournisseurs tiers (hébergement, téléphonie, etc.)</li>
                <li>Des virus informatiques ou attaques malveillantes subies malgré les protections mises en place</li>
                <li>Du contenu des sites tiers vers lesquels des liens hypertextes peuvent renvoyer</li>
              </ul>

              <p className="text-sm italic">
                L'utilisateur reconnaît utiliser les services à ses propres risques et sous sa responsabilité exclusive.
              </p>
            </section>

            {/* LIENS HYPERTEXTES */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Liens Hypertextes</h2>
              
              <p className="mb-4">
                Le site www.zencall.ai peut contenir des liens hypertextes vers d'autres sites internet. 
                JARVIS ne dispose d'aucun contrôle sur ces sites et décline toute responsabilité quant à 
                leur contenu ou leur disponibilité.
              </p>

              <p className="mb-4">
                La création de liens hypertextes vers le site www.zencall.ai est soumise à l'autorisation 
                préalable écrite de JARVIS. Les demandes doivent être adressées à{" "}
                <a href="mailto:contact@zencall.ai" className="text-blue-600 hover:underline">contact@zencall.ai</a>.
              </p>
            </section>

            {/* DROIT APPLICABLE */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. Droit Applicable et Juridiction</h2>
              
              <p className="mb-4">
                Les présentes mentions légales sont soumises au <strong>droit français</strong>.
              </p>

              <p className="mb-4">
                Tout litige relatif à l'utilisation du site www.zencall.ai sera soumis à la compétence exclusive 
                des tribunaux du ressort de [VILLE DU SIÈGE SOCIAL], sauf dispositions légales contraires 
                (notamment pour les consommateurs).
              </p>
            </section>

            {/* CONTACT */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. Contact</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="mb-4 font-medium">Pour toute question concernant les mentions légales :</p>
                
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-bold text-gray-900">Email principal :</dt>
                    <dd>
                      <a href="mailto:contact@zencall.ai" className="text-blue-600 hover:underline">
                        contact@zencall.ai
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Questions juridiques :</dt>
                    <dd>
                      <a href="mailto:legal@zencall.ai" className="text-blue-600 hover:underline">
                        legal@zencall.ai
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Protection des données :</dt>
                    <dd>
                      <a href="mailto:dpo@zencall.ai" className="text-blue-600 hover:underline">
                        dpo@zencall.ai
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-gray-900">Adresse postale :</dt>
                    <dd>
                      JARVIS<br />
                      [Adresse complète selon KBIS]
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* MISE À JOUR */}
            <section>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm">
                  <strong>ℹ️ Dernière mise à jour :</strong> 26 décembre 2025
                </p>
                <p className="text-sm mt-2">
                  JARVIS se réserve le droit de modifier à tout moment les présentes mentions légales. 
                  Les modifications sont applicables dès leur mise en ligne.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
