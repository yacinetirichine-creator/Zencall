# 🎯 Architecture Multi-Tenant Zencall

## Vue d'ensemble

Zencall est une plateforme SaaS **multi-tenant** permettant à chaque organisation de gérer ses propres intégrations téléphoniques (VAPI, Twilio) et ses assistants vocaux.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                  │
│  - App Router                                           │
│  - Server Components + Client Components                │
│  - Authentication (Supabase Auth)                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Routes (/api/v1)                  │
│  - /auth/register (B2B/B2C inscription)                 │
│  - /vapi/assistants (Sync VAPI)                         │
│  - /vapi/webhook (Events VAPI)                          │
│  - /campaigns/start (Campagnes)                         │
│  - /twilio/webhook (SMS callbacks)                      │
└─────────────────────────────────────────────────────────┘
                            │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │   VAPI.ai    │  │    Twilio    │
│  PostgreSQL  │  │  (Voice AI)  │  │  (SMS/Voice) │
│  + Realtime  │  │              │  │ Multi-tenant │
│  + Auth      │  │ Shared Keys  │  │ Per-org keys │
└──────────────┘  └──────────────┘  └──────────────┘
```

## 🔐 Modèle de données

### Organizations
Chaque client (B2B ou B2C) a une organisation :
```typescript
{
  id: UUID
  name: string
  organization_type: 'b2b' | 'b2c'
  
  // Twilio - Spécifique à chaque org
  twilio_account_sid: string
  twilio_auth_token_encrypted: string
  twilio_phone_number: string
  twilio_configured: boolean
  
  // B2B uniquement
  company_registration: string (SIRET/SIREN)
  vat_number: string
}
```

### Profiles (Utilisateurs)
```typescript
{
  id: UUID
  email: string
  full_name: string
  organization_id: UUID (FK)
  role: 'admin' | 'member'
  
  // RGPD
  gdpr_consent_at: timestamp
  terms_accepted_at: timestamp
  marketing_consent: boolean
}
```

### Assistants
Liés à une organisation via `organization_id` :
```typescript
{
  id: UUID
  organization_id: UUID (FK)
  vapi_assistant_id: string
  name: string
  model: string
  voice: string
  // ...
}
```

## 🔄 Flux d'inscription

### B2B (Entreprise)
```
1. User visite /register-new
2. Choix "Entreprise (B2B)"
3. Formulaire :
   - Infos personnelles (nom, email, password)
   - Infos entreprise (nom société, SIRET, TVA)
   - Consentements RGPD (CGU, Privacy, Marketing)
4. POST /api/auth/register
   └─> Création compte Supabase Auth
   └─> Création Organization (type: b2b)
   └─> Création Profile (role: admin)
   └─> Enregistrement consentements RGPD
   └─> Audit log
5. Email de confirmation
6. Accès au dashboard
```

### B2C (Particulier)
```
1. User visite /register-new
2. Choix "Particulier (B2C)"
3. Formulaire :
   - Infos personnelles uniquement
   - Consentements RGPD
4. POST /api/auth/register
   └─> Même process, mais organization_type: 'b2c'
   └─> Pas de champs entreprise requis
5. Email de confirmation
6. Accès au dashboard
```

## 🔌 Intégrations Multi-Tenant

### Twilio (Par organisation)

Chaque organisation configure ses propres credentials :

```typescript
// Client Twilio dynamique
const twilioClient = await TwilioClient.forOrganization(organizationId);
await twilioClient.messages.create({
  to: '+33...',
  from: organization.twilio_phone_number,
  body: 'Message'
});
```

**Configuration** :
- Aller dans Settings > Integrations
- Entrer Account SID, Auth Token, Phone Number
- Sauvegarder (token chiffré en DB)

### VAPI.ai (Partagé)

Clés VAPI globales, mais assistants taggés par organisation :

```typescript
// Création assistant
await vapi.assistants.create({
  name: 'Support Client',
  // ... config
});

// Stockage en DB avec organization_id
await supabase.from('assistants').insert({
  organization_id: user.organization_id,
  vapi_assistant_id: assistant.id,
  // ...
});
```

**Isolation** : Row Level Security (RLS) garantit que chaque org ne voit que ses assistants.

## 🛡️ Sécurité

### Row Level Security (RLS)
Toutes les tables ont des policies RLS :
```sql
-- Example pour assistants
CREATE POLICY "Users can only view their org's assistants"
ON assistants FOR SELECT
USING (organization_id = auth.jwt() ->> 'organization_id');
```

### Chiffrement
- Twilio Auth Token : chiffré avec `pgcrypto` avant stockage
- Passwords : hash bcrypt via Supabase Auth
- API Keys : hash bcrypt + timing-safe compare

### Headers HTTP
```javascript
// next.config.js
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  // ... CSP, etc.
]
```

## 📊 RGPD

### Tables de conformité

```typescript
// gdpr_consents
{
  user_id: UUID
  consent_type: 'terms' | 'privacy' | 'marketing' | 'cookies'
  consent_given: boolean
  consent_version: string
  ip_address: string
  user_agent: string
  created_at: timestamp
}

// gdpr_requests
{
  user_id: UUID
  organization_id: UUID
  request_type: 'data_access' | 'data_export' | 'data_deletion'
  status: 'pending' | 'processing' | 'completed'
  data_url: string (lien téléchargement)
  created_at: timestamp
}

// gdpr_audit_logs
{
  user_id: UUID
  organization_id: UUID
  action: string (account_created, data_exported, etc.)
  details: jsonb
  ip_address: string
  created_at: timestamp
}
```

### Pages RGPD
- `/legal/privacy` - Politique de confidentialité
- `/legal/terms` - CGU
- `/settings/gdpr` - Dashboard utilisateur (export, suppression)

## 🚀 Webhooks

### VAPI Webhook (`/api/vapi/webhook`)
Events supportés :
- `call-started` - Début d'appel
- `call-ended` - Fin d'appel
- `transcript` - Transcription
- `transfer` - Transfert d'appel
- `appointment-booked` - RDV pris
- + sentiment analysis automatique

### Twilio Webhook (`/api/twilio/webhook`)
- Status callbacks SMS
- Delivery reports
- Erreurs

## 📦 Déploiement

### Variables d'environnement requises
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
VAPI_PRIVATE_KEY=
NEXT_PUBLIC_APP_URL=
```

### Commandes
```bash
# Développement
npm run dev

# Build production
npm run build

# Déploiement Vercel
./scripts/deploy.sh production
```

### Checklist
1. ✅ Migration 004 exécutée dans Supabase
2. ✅ Variables env configurées sur Vercel
3. ✅ Webhook VAPI configuré
4. ✅ Tests B2B/B2C effectués
5. ✅ RLS activé sur toutes les tables

## 🎨 Stack Technique

- **Frontend** : Next.js 14 (App Router), React, TypeScript
- **Styling** : Tailwind CSS (palette Zencall custom)
- **Database** : Supabase PostgreSQL + Realtime
- **Auth** : Supabase Auth
- **Validation** : Zod
- **Telephony** : VAPI.ai (Voice AI), Twilio (SMS)
- **Deployment** : Vercel
- **Icons** : Lucide React

## 📚 Ressources

- [Guide de déploiement complet](./DEPLOYMENT_GUIDE.md)
- [Documentation VAPI](https://docs.vapi.ai)
- [Documentation Twilio](https://www.twilio.com/docs)
- [Documentation Supabase](https://supabase.com/docs)

---

**Auteur** : Équipe Zencall  
**Version** : 1.0.0  
**License** : Propriétaire
