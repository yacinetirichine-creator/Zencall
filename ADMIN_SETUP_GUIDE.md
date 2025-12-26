# Guide de Configuration Admin - Zen-Call

## 🚀 Démarrage Rapide

Ce guide vous permet de configurer votre compte administrateur et commencer à utiliser le système d'administration complet.

---

## 📋 Prérequis

- Un compte utilisateur créé sur la plateforme
- Accès à Supabase SQL Editor
- Variables d'environnement configurées

---

## 🔧 Étape 1 : Appliquer la Migration

### Option A : Via Supabase CLI (Recommandé)

```bash
# Dans le dossier du projet
supabase db push
```

### Option B : Via Supabase Dashboard

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet Zencall
3. Cliquez sur "SQL Editor" dans la barre latérale
4. Cliquez sur "New Query"
5. Copiez le contenu de `supabase/migrations/006_admin_system.sql`
6. Collez et exécutez

---

## 👤 Étape 2 : Créer Votre Compte Admin

### 2.1 Obtenir Votre User ID

1. Inscrivez-vous sur la plateforme : `/register`
2. Connectez-vous : `/login`
3. Dans Supabase Dashboard, allez à "Authentication" → "Users"
4. Trouvez votre utilisateur et copiez l'UUID (ex: `123e4567-e89b-12d3-a456-426614174000`)

### 2.2 Créer l'Entrée Admin

Dans Supabase SQL Editor, exécutez :

```sql
-- Remplacez 'VOTRE-USER-UUID-ICI' par votre UUID réel
INSERT INTO public.admin_users (user_id, role, permissions, created_by)
VALUES (
  'VOTRE-USER-UUID-ICI',
  'super_admin',
  '{
    "view_analytics": true,
    "view_complaints": true,
    "manage_users": true,
    "manage_billing": true
  }'::jsonb,
  'VOTRE-USER-UUID-ICI'
);
```

### 2.3 Vérifier la Création

```sql
-- Vérifier que votre compte admin existe
SELECT * FROM public.admin_users WHERE user_id = 'VOTRE-USER-UUID-ICI';
```

---

## 🔑 Étape 3 : Configurer les Variables d'Environnement

### Vercel (Production)

```bash
# Ajouter les clés API via Vercel CLI
vercel env add AI_COMPLAINT_API_KEY
# Entrez une clé sécurisée (ex: générez avec openssl rand -hex 32)

vercel env add COST_TRACKING_API_KEY
vercel env add REVENUE_TRACKING_API_KEY
vercel env add CRON_SECRET
```

### Local (.env.local)

```bash
# Créez ou éditez .env.local
AI_COMPLAINT_API_KEY=votre-cle-secrete-ai-complaints
COST_TRACKING_API_KEY=votre-cle-secrete-costs
REVENUE_TRACKING_API_KEY=votre-cle-secrete-revenue
CRON_SECRET=votre-cle-secrete-cron

# Générer des clés sécurisées :
# openssl rand -hex 32
```

---

## 📊 Étape 4 : Accéder au Dashboard

1. Allez sur `/admin` (ex: `https://zen-call.net/admin`)
2. Vous verrez le dashboard avec :
   - ✅ Nombre de clients
   - ✅ CA (Chiffre d'Affaires)
   - ✅ Coûts totaux
   - ✅ Plaintes ouvertes
   - ✅ Métriques détaillées

---

## ⚙️ Étape 5 : Configurer les Cron Jobs

### Option A : Vercel Cron (Recommandé pour production)

Créez ou modifiez `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/admin/analytics/record",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Déployez :
```bash
git add vercel.json
git commit -m "Add daily analytics cron"
git push
```

### Option B : Supabase pg_cron

Dans Supabase SQL Editor :

```sql
-- Activer l'extension pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Planifier l'enregistrement quotidien à minuit UTC
SELECT cron.schedule(
  'record-daily-analytics',
  '0 0 * * *',
  $$SELECT public.record_daily_analytics();$$
);

-- Vérifier les cron jobs
SELECT * FROM cron.job;
```

### Option C : GitHub Actions

Créez `.github/workflows/daily-analytics.yml` :

```yaml
name: Record Daily Analytics
on:
  schedule:
    - cron: '0 0 * * *'  # Tous les jours à minuit UTC
  workflow_dispatch:  # Permet déclenchement manuel

jobs:
  record-analytics:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Analytics Recording
        run: |
          curl -X POST https://zen-call.net/api/admin/analytics/record \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Ajoutez le secret `CRON_SECRET` dans GitHub Settings → Secrets and variables → Actions.

---

## 🤖 Étape 6 : Configurer Vapi.ai pour les Plaintes

### Ajouter le Webhook Vapi

Dans votre configuration Vapi.ai :

```javascript
// server.js (votre backend)
app.post('/vapi/webhook', async (req, res) => {
  const { message, call, transcript } = req.body;
  
  // Indicateurs de plaintes
  const complaintKeywords = [
    'problème', 'frustré', 'mécontent', 'annuler', 
    'remboursement', 'déçu', 'en colère', 'bug'
  ];
  
  const transcriptLower = (transcript || '').toLowerCase();
  const hasComplaint = complaintKeywords.some(keyword => 
    transcriptLower.includes(keyword)
  );
  
  if (hasComplaint) {
    // Déterminer la sévérité
    const severity = 
      transcriptLower.includes('annuler') || 
      transcriptLower.includes('en colère') ? 'high' : 'medium';
    
    // Envoyer à l'API de plaintes
    try {
      await fetch('https://zen-call.net/api/admin/complaints/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: call.customer?.id,
          call_id: call.id,
          title: 'Mécontentement client détecté',
          description: 'Sentiment négatif détecté durant la conversation',
          transcript: transcript,
          complaint_type: 'service_quality',
          severity: severity,
          confidence_score: 0.75,
          api_key: process.env.AI_COMPLAINT_API_KEY,
        }),
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  }
  
  res.sendStatus(200);
});
```

---

## 💰 Étape 7 : Configurer Stripe Webhooks

### 7.1 Créer le Webhook Stripe

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Cliquez "Add endpoint"
3. URL : `https://zen-call.net/api/admin/revenue/track`
4. Sélectionnez les événements :
   - `payment_intent.succeeded`
   - `invoice.paid`
   - `charge.refunded`

### 7.2 Gérer les Webhooks Stripe

Créez `src/app/api/stripe/webhook/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Gérer les paiements réussis
  if (event.type === 'payment_intent.succeeded') {
    const payment = event.data.object as Stripe.PaymentIntent;
    
    // Enregistrer le revenu
    await fetch('https://zen-call.net/api/admin/revenue/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: payment.metadata.user_id,
        transaction_type: 'subscription',
        amount_cents: payment.amount,
        currency: payment.currency.toUpperCase(),
        stripe_payment_id: payment.id,
        plan_type: payment.metadata.plan_type,
        billing_period: payment.metadata.billing_period,
        description: `Payment for ${payment.metadata.plan_type} plan`,
        api_key: process.env.REVENUE_TRACKING_API_KEY,
      }),
    });
  }
  
  // Gérer les remboursements
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    
    await fetch('https://zen-call.net/api/admin/revenue/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: charge.metadata.user_id,
        transaction_type: 'refund',
        amount_cents: -charge.amount_refunded,
        currency: charge.currency.toUpperCase(),
        stripe_payment_id: charge.payment_intent as string,
        description: 'Refund',
        api_key: process.env.REVENUE_TRACKING_API_KEY,
      }),
    });
  }
  
  return NextResponse.json({ received: true });
}
```

---

## 📧 Étape 8 : Configurer les Alias Emails

Chez votre fournisseur de domaine (ex: Cloudflare, OVH, Gandi) :

1. Créez les adresses suivantes pointant vers votre email principal :
   - `admin@zen-call.net`
   - `dpo@zen-call.net`
   - `privacy@zen-call.net`
   - `support@zen-call.net`
   - `contact@zen-call.net`
   - `legal@zen-call.net`
   - `billing@zen-call.net`

2. Configurez le forwarding vers votre email (ex: `vous@gmail.com`)

---

## 🧪 Étape 9 : Tester le Système

### Test 1 : Dashboard

```bash
# Visitez
https://zen-call.net/admin

# Vérifiez que vous voyez :
✅ Total Clients
✅ CA (30 jours)
✅ Coûts
✅ Plaintes
```

### Test 2 : API Analytics

```bash
curl -X POST https://zen-call.net/api/admin/analytics/record \
  -H "Authorization: Bearer VOTRE_CRON_SECRET"

# Réponse attendue :
# {"success": true, "message": "Daily analytics recorded successfully"}
```

### Test 3 : Créer une Plainte Test

```bash
curl -X POST https://zen-call.net/api/admin/complaints/ai \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test complaint from AI",
    "description": "This is a test complaint",
    "complaint_type": "technical",
    "severity": "low",
    "confidence_score": 0.5,
    "api_key": "VOTRE_AI_COMPLAINT_API_KEY"
  }'

# Réponse attendue :
# {"success": true, "complaint_id": "..."}
```

### Test 4 : Vérifier la Plainte

Visitez `/admin/complaints` et vérifiez que la plainte test apparaît.

---

## 📝 Étape 10 : Insérer les Données KBIS

Dans les documents légaux (`/src/app/legal/mentions/page.tsx`), remplacez les placeholders :

```typescript
// Cherchez et remplacez :
<p><strong>Raison sociale :</strong> JARVIS</p>
<p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
<p><strong>Capital social :</strong> [À INSÉRER] €</p>
<p><strong>SIRET :</strong> [À INSÉRER]</p>
<p><strong>RCS :</strong> [À INSÉRER]</p>
<p><strong>APE :</strong> [À INSÉRER]</p>
<p><strong>Siège social :</strong> [ADRESSE À INSÉRER]</p>
<p><strong>Responsable de publication :</strong> [NOM À INSÉRER]</p>

// Par vos vraies données :
<p><strong>Raison sociale :</strong> JARVIS</p>
<p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
<p><strong>Capital social :</strong> 10 000 €</p>
<p><strong>SIRET :</strong> 123 456 789 00012</p>
<p><strong>RCS :</strong> Paris B 123 456 789</p>
<p><strong>APE :</strong> 6201Z</p>
<p><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
<p><strong>Responsable de publication :</strong> Jean Dupont, Président</p>
```

---

## ✅ Checklist Finale

- [ ] Migration 006_admin_system.sql appliquée
- [ ] Compte admin créé avec votre user_id
- [ ] Variables d'environnement configurées (4 clés API)
- [ ] Accès au dashboard `/admin` vérifié
- [ ] Cron job quotidien configuré (Vercel/Supabase/GitHub)
- [ ] Webhook Vapi.ai configuré pour les plaintes
- [ ] Webhook Stripe configuré pour les revenus
- [ ] Alias emails configurés (7 adresses)
- [ ] Données KBIS insérées dans mentions légales
- [ ] Tests effectués (dashboard, API, plaintes)

---

## 🆘 Dépannage

### Erreur "Forbidden: Admin access required"

```sql
-- Vérifier que votre user_id est bien dans admin_users
SELECT * FROM public.admin_users WHERE user_id = 'VOTRE-UUID';

-- Si vide, recréer :
INSERT INTO public.admin_users (user_id, role, permissions, created_by)
VALUES ('VOTRE-UUID', 'super_admin', '{"view_analytics":true,"view_complaints":true,"manage_users":true,"manage_billing":true}'::jsonb, 'VOTRE-UUID');
```

### Dashboard vide / Pas de données

```sql
-- Forcer l'enregistrement des analytics
SELECT public.record_daily_analytics();

-- Vérifier les données
SELECT * FROM public.analytics_metrics ORDER BY metric_date DESC LIMIT 5;
```

### Webhook Stripe ne fonctionne pas

1. Vérifiez `STRIPE_WEBHOOK_SECRET` dans `.env.local`
2. Testez avec Stripe CLI :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger payment_intent.succeeded
```

### Plaintes IA ne s'affichent pas

```sql
-- Vérifier les plaintes
SELECT * FROM public.complaints WHERE detected_by_ai = true;

-- Créer une plainte test
SELECT public.create_ai_complaint(
  null, null, 'Test', 'Description test', null, 
  'technical', 'low', 0.5
);
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **ADMIN_SYSTEM.md** - Documentation technique complète
- **LEGAL_INFRASTRUCTURE.md** - Système légal et RGPD
- **SECURITY_RGPD_AUDIT_2025.md** - Audit sécurité

---

## 🎯 Prochaines Étapes

Après la configuration :

1. **Ajoutez d'autres admins** (si nécessaire) :
```sql
INSERT INTO public.admin_users (user_id, role, permissions, created_by)
VALUES ('uuid-du-nouvel-admin', 'admin', '{"view_analytics":true,"view_complaints":true,"manage_users":false,"manage_billing":true}'::jsonb, 'VOTRE-UUID');
```

2. **Configurez les alertes** (via webhook Discord/Slack/Email)
3. **Importez les données historiques** (si migration depuis ancien système)
4. **Formez votre équipe** à l'utilisation du dashboard

---

## 💡 Conseils

- **Sauvegardez vos clés API** dans un gestionnaire de mots de passe
- **Activez l'authentification 2FA** sur Supabase et Vercel
- **Surveillez les plaintes critiques** quotidiennement
- **Vérifiez la marge bénéficiaire** hebdomadairement
- **Revoyez les coûts Vapi/Twilio** mensuellement

---

## 📞 Support

Besoin d'aide ?
- Email : `admin@zen-call.net`
- Documentation : `/ADMIN_SYSTEM.md`
- GitHub Issues : [github.com/votre-repo/issues](https://github.com/votre-repo/issues)

---

**Félicitations ! 🎉**  
Votre système d'administration est maintenant opérationnel.

Vous avez maintenant :
- ✅ Visibilité complète sur vos clients
- ✅ Suivi du CA en temps réel
- ✅ Monitoring des coûts
- ✅ Détection automatique des plaintes par IA
- ✅ Tableau de bord administrateur professionnel
