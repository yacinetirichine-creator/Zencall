# 🚀 Guide de Configuration Zencall

## ✅ Déjà fait

- ✅ Base de données créée avec 18 tables complètes
- ✅ Données de test insérées (organisation, assistants, contacts, appels)
- ✅ Tous les types TypeScript synchronisés
- ✅ Hooks de données complétés
- ✅ Pages principales développées
- ✅ Serveur de développement lancé

## 📝 Configuration requise

### 1. Configurer les clés Supabase

Éditez le fichier `.env.local` et ajoutez vos vraies clés :

```bash
# Allez sur https://sxfwjxurircmulwoybic.supabase.co
# Settings → API → Copiez les clés

NEXT_PUBLIC_SUPABASE_URL=https://sxfwjxurircmulwoybic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>
```

### 2. Créer un compte utilisateur

1. Ouvrez http://localhost:3000
2. Allez sur `/register`
3. Créez un compte avec :
   - **Email** : admin@demo.com
   - **Mot de passe** : Minimum 8 caractères
   - **Nom organisation** : Demo Company

### 3. Lier votre compte à l'organisation de test

Après inscription, exécutez cette requête dans Supabase SQL Editor :

```sql
-- Remplacez USER_ID par l'UUID de votre compte (visible dans auth.users)
UPDATE profiles 
SET organization_id = '00000000-0000-0000-0000-000000000001', 
    role = 'org_admin'
WHERE email = 'admin@demo.com';
```

### 4. Configurer VAPI (optionnel - pour les vrais appels)

```bash
# Inscrivez-vous sur https://vapi.ai
# Créez un compte et récupérez vos clés API

VAPI_API_KEY=<votre_vapi_api_key>
NEXT_PUBLIC_VAPI_PUBLIC_KEY=<votre_vapi_public_key>
```

## 🎯 Tester l'application

### Pages disponibles :

1. **Dashboard** : http://localhost:3000/dashboard
   - Vue d'ensemble avec statistiques
   - Graphiques d'appels des 7 derniers jours
   - Appels récents

2. **Assistants** : http://localhost:3000/dashboard/assistants
   - 3 assistants pré-configurés
   - Créer/modifier/supprimer des assistants

3. **Appels** : http://localhost:3000/dashboard/calls
   - Historique de 4 appels de démonstration
   - Détails, transcriptions, sentiments

4. **Contacts** : http://localhost:3000/dashboard/contacts
   - 4 contacts de test
   - Ajouter/modifier/supprimer des contacts

5. **Rendez-vous** : http://localhost:3000/dashboard/appointments
   - 3 rendez-vous (passés et à venir)
   - Créer/modifier des RDV

6. **Campagnes** : http://localhost:3000/dashboard/campaigns
   - 2 campagnes de démonstration
   - Statistiques de performance

7. **Facturation** : http://localhost:3000/dashboard/billing
   - Plan actuel (Pro)
   - Usage mensuel
   - Factures

## 🔧 Commandes utiles

```bash
# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start

# Vérifier le code
npm run lint
```

## 📊 Données de test disponibles

- **1 Organisation** : Demo Company (plan Pro)
- **3 Assistants** :
  - Assistant Accueil (127 appels, 856 min)
  - Assistant Rendez-vous (89 appels, 445 min)
  - Assistant Support (56 appels, 672 min)
- **4 Contacts** avec historique
- **4 Appels** avec transcriptions
- **3 Rendez-vous**
- **2 Campagnes**
- **Métriques** : 272 appels ce mois-ci

## 🐛 Dépannage

### Erreur de connexion Supabase
- Vérifiez que les clés dans `.env.local` sont correctes
- Redémarrez le serveur après modification

### Pas de données visibles
- Assurez-vous que votre profil est lié à l'organisation de test
- Vérifiez que les données de test sont bien insérées (SQL Editor)

### Erreur de compilation
```bash
rm -rf .next
npm install
npm run dev
```

## 🚀 Prochaines étapes

1. **Intégration VAPI** :
   - Configurer les webhooks VAPI
   - Tester les appels en temps réel
   - Connecter les assistants à VAPI

2. **Intégration Stripe** :
   - Configurer les webhooks Stripe
   - Activer les paiements
   - Gérer les abonnements

3. **Calendrier** :
   - Connecter Google Calendar
   - Synchronisation automatique des RDV

4. **Personnalisation** :
   - Modifier le design selon vos besoins
   - Ajouter votre logo
   - Configurer les emails

## 📚 Ressources

- **Documentation Supabase** : https://supabase.com/docs
- **Documentation VAPI** : https://docs.vapi.ai
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Tailwind** : https://tailwindcss.com/docs

---

**Application accessible sur** : http://localhost:3000

Bon développement ! 🎉
