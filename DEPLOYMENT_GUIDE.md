# Guide de Déploiement Complet - Zencall

## 📋 État actuel du projet

✅ **Fonctionnalités implémentées :**
- Architecture multi-tenant complète
- Intégration VAPI.ai pour la téléphonie vocale
- Intégration Twilio multi-tenant (SMS par organisation)
- Système de campagnes d'appels automatisé
- Dashboard temps réel avec Supabase Realtime
- Webhooks VAPI enrichis (sentiment, transferts, rendez-vous)
- Pages légales RGPD (CGU, Politique de confidentialité)
- Dashboard RGPD pour les utilisateurs
- Inscription différenciée B2B/B2C
- Headers de sécurité HTTP configurés

## 🔧 Prérequis

### 1. Migration de base de données
La migration `004_gdpr_and_multi_tenant.sql` doit être exécutée dans Supabase :

```bash
# Se connecter à Supabase Dashboard
# Aller dans Database > Migrations
# Exécuter le fichier : supabase/migrations/004_gdpr_and_multi_tenant.sql
```

Cette migration ajoute :
- Champs Twilio multi-tenant à `organizations`
- Type d'organisation (B2B/B2C)
- Tables RGPD : `gdpr_consents`, `gdpr_requests`, `gdpr_audit_logs`
- Champs de consentement RGPD dans `profiles`

### 2. Variables d'environnement

Créer un fichier `.env.local` (ou `.env.production` pour la prod) :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sxfwjxurircmulwoybic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# VAPI.ai
NEXT_PUBLIC_VAPI_PUBLIC_KEY=6709c0ea-154e-435d-8f91-47ee06d6e66c
VAPI_PRIVATE_KEY=7e74ad42-7e03-4181-9cb6-134edb4c0ba9

# Twilio (optionnel - chaque org configure le sien)
# Ces variables ne sont plus utilisées directement
# Les credentials Twilio sont stockés par organisation

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Déploiement sur Vercel

### 1. Préparation

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login
```

### 2. Déploiement

```bash
# Premier déploiement
cd /workspaces/Zencall
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? zencall
# - Directory? ./
# - Override settings? No

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_VAPI_PUBLIC_KEY
vercel env add VAPI_PRIVATE_KEY
vercel env add NEXT_PUBLIC_APP_URL

# Déployer en production
vercel --prod
```

### 3. Après le déploiement

Une fois déployé, vous obtiendrez une URL type : `https://zencall.vercel.app`

**Configuration des webhooks VAPI :**
1. Aller sur https://dashboard.vapi.ai
2. Naviguer vers Settings > Webhooks
3. Configurer l'URL : `https://votre-app.vercel.app/api/vapi/webhook`
4. Activer tous les événements nécessaires

## 🧪 Tests à effectuer

### 1. Test d'inscription B2B
```
1. Aller sur /register-new
2. Choisir "Entreprise (B2B)"
3. Remplir le formulaire avec :
   - Nom complet
   - Email
   - Mot de passe
   - Nom d'entreprise
   - SIRET (optionnel)
   - Accepter les CGU et politique de confidentialité
4. Vérifier l'email de confirmation
5. Confirmer le compte
```

### 2. Test d'inscription B2C
```
1. Aller sur /register-new
2. Choisir "Particulier (B2C)"
3. Remplir le formulaire (sans infos entreprise)
4. Accepter les conditions
5. Vérifier l'email
```

### 3. Test de configuration Twilio
```
1. Se connecter avec un compte
2. Aller dans Settings > Integrations
3. Ajouter Account SID, Auth Token, Phone Number
4. Sauvegarder
5. Tester l'envoi d'un SMS
```

### 4. Test de création d'assistant
```
1. Aller dans Assistants
2. Créer un nouvel assistant
3. Vérifier la synchronisation avec VAPI
4. Vérifier l'apparition dans le dashboard VAPI
```

### 5. Test RGPD
```
1. Aller dans Settings > GDPR
2. Demander un export de données
3. Vérifier la création de la demande
4. Vérifier l'audit log
```

## 📊 Architecture multi-tenant

### Comment ça fonctionne

1. **Inscription** :
   - Utilisateur s'inscrit (B2B ou B2C)
   - Organisation automatiquement créée
   - Utilisateur lié à l'organisation avec rôle 'admin'

2. **Configuration Twilio** :
   - Chaque organisation configure ses propres credentials Twilio
   - Stockage sécurisé (token chiffré) dans la table `organizations`
   - Client Twilio instancié dynamiquement : `TwilioClient.forOrganization(orgId)`

3. **Configuration VAPI** :
   - Chaque organisation utilise les mêmes clés VAPI globales
   - Les assistants sont taggés par `organization_id`
   - Isolation des données via RLS (Row Level Security)

## 🔒 Sécurité

### Headers HTTP configurés (next.config.js)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`
- `Strict-Transport-Security` (HSTS)
- CSP (Content Security Policy)

### Validation Zod
Tous les endpoints API utilisent Zod pour valider :
- Format des emails
- Force des mots de passe
- Données de campagne
- Credentials Twilio

### RGPD
- Consentements trackés avec IP et User-Agent
- Demandes d'accès/export/suppression
- Audit logs complets
- Retention policies configurables

## 📝 Pages créées

### Auth
- `/register-new` - Inscription avec choix B2B/B2C
- `/register/success` - Confirmation d'inscription
- `/login` - Connexion (existante)
- `/forgot-password` - Réinitialisation mot de passe (existante)

### Dashboard
- `/dashboard` - Vue d'ensemble
- `/assistants` - Gestion des assistants VAPI
- `/calls` - Historique d'appels
- `/campaigns` - Campagnes automatisées
- `/contacts` - Gestion des contacts
- `/settings/integrations` - Configuration Twilio
- `/settings/gdpr` - Gestion données RGPD

### Légal
- `/legal/terms` - Conditions générales d'utilisation
- `/legal/privacy` - Politique de confidentialité

### API
- `POST /api/auth/register` - Inscription avec RGPD
- `POST /api/vapi/assistants` - Sync assistants VAPI
- `POST /api/vapi/webhook` - Webhooks VAPI
- `POST /api/campaigns/start` - Lancer une campagne
- `POST /api/twilio/webhook` - Callbacks Twilio

## 🐛 Dépannage

### Erreur de migration
Si la migration échoue, vérifier :
```sql
-- Vérifier si uuid_generate_v4 est disponible
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vérifier les tables existantes
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Twilio ne fonctionne pas
```bash
# Vérifier les credentials dans la DB
SELECT twilio_configured, twilio_account_sid 
FROM organizations 
WHERE id = 'votre_org_id';

# Tester avec curl
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json \
  -u YOUR_SID:YOUR_TOKEN \
  -d "To=+33..." \
  -d "From=+..." \
  -d "Body=Test"
```

### VAPI webhooks ne marchent pas
1. Vérifier que l'URL est accessible publiquement
2. Vérifier les logs Vercel
3. Tester avec curl :
```bash
curl -X POST https://votre-app.vercel.app/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"call-started","call":{"id":"test"}}'
```

## ✅ Checklist de mise en production

- [ ] Migration 004 exécutée dans Supabase
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Application déployée sur Vercel
- [ ] URL webhook configurée dans VAPI
- [ ] Test d'inscription B2B réussi
- [ ] Test d'inscription B2C réussi
- [ ] Test de connexion réussi
- [ ] Test de configuration Twilio réussi
- [ ] Test de création d'assistant réussi
- [ ] Pages légales accessibles
- [ ] Dashboard RGPD fonctionnel
- [ ] Headers de sécurité vérifiés
- [ ] Email de confirmation fonctionne
- [ ] RLS (Row Level Security) activé sur toutes les tables

## 📞 Support

Pour toute question :
- Documentation VAPI : https://docs.vapi.ai
- Documentation Twilio : https://www.twilio.com/docs
- Documentation Supabase : https://supabase.com/docs
- Documentation Next.js : https://nextjs.org/docs

---

**Version :** 1.0.0  
**Dernière mise à jour :** $(date +%Y-%m-%d)  
**Environnement :** Production-ready
