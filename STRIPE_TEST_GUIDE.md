# 💳 Configuration Stripe - Test Complet

## ✅ CE QUI EST FAIT

### 1. Configuration des clés
- ✅ Clés Stripe de test configurées dans `.env.local`
- ✅ Secret Key: `sk_test_51Sj1j0PNU9Au1ZEM...`
- ✅ Publishable Key: `pk_test_51Sj1j0PNU9Au1ZEM...`

### 2. Produits créés dans Stripe

| Plan | ID Produit | ID Prix | Prix |
|------|-----------|---------|------|
| **Starter** | `prod_TgOkTcNpw9U1Me` | `price_1Sj1xAPNU9Au1ZEMqWXUX0In` | 49€/mois |
| **Pro** | `prod_TgOkoq6whpDI7R` | `price_1Sj1xBPNU9Au1ZEMD8K4VO97` | 99€/mois |
| **Business** | `prod_TgOklVC6kd2Ssc` | `price_1Sj1xCPNU9Au1ZEMO1oZthmY` | 199€/mois |

### 3. Code implémenté

#### Fichiers créés :
- ✅ `/src/lib/stripe/client.ts` - Client Stripe centralisé
- ✅ `/src/app/api/stripe/create-checkout-session/route.ts` - Création de sessions
- ✅ `/src/app/api/stripe/cancel-subscription/route.ts` - Annulation d'abonnements
- ✅ `/src/app/api/stripe/webhook/route.ts` - Handler de webhooks (déjà existant)
- ✅ `/src/app/stripe-test/page.tsx` - Page de test de paiement
- ✅ `/scripts/setup-stripe.ts` - Script de setup automatique

#### Fonctionnalités :
- ✅ Création de sessions de checkout
- ✅ Abonnements mensuels avec 14 jours d'essai gratuit
- ✅ Gestion des webhooks (paiement réussi, refund, etc.)
- ✅ Annulation d'abonnements
- ✅ Tracking des revenus

---

## 🧪 TESTS À EFFECTUER

### Test 1 : Page de test de paiement

```bash
# Accéder à la page de test
http://localhost:3000/stripe-test
```

**Checklist :**
- [ ] La page s'affiche correctement
- [ ] Les 3 plans (Starter, Pro, Business) sont visibles
- [ ] Les prix sont corrects (49€, 99€, 199€)

### Test 2 : Flux de paiement complet

1. **Se connecter** (ou créer un compte)
   ```
   http://localhost:3000/login
   ```

2. **Cliquer sur "Tester le paiement"** pour le plan de votre choix

3. **Utiliser une carte de test Stripe :**
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future (ex: 12/25)
   - CVC : N'importe quel 3 chiffres (ex: 123)
   - Code postal : N'importe lequel (ex: 75001)

4. **Vérifier la redirection** vers la page de succès

### Test 3 : Vérification dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/test/payments
2. Vérifier que le paiement apparaît
3. Vérifier le montant et le statut

### Test 4 : Webhooks (Local avec Stripe CLI)

```bash
# Installer Stripe CLI si pas déjà fait
brew install stripe/stripe-cli/stripe  # macOS
# ou télécharger depuis https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Écouter les webhooks localement
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Dans un autre terminal, déclencher un événement test
stripe trigger payment_intent.succeeded
```

---

## 💳 CARTES DE TEST STRIPE

| Carte | Résultat |
|-------|----------|
| `4242 4242 4242 4242` | ✅ Paiement réussi |
| `4000 0025 0000 3155` | 🔐 Nécessite 3D Secure |
| `4000 0000 0000 9995` | ❌ Refusé (fonds insuffisants) |
| `4000 0000 0000 0002` | ❌ Refusé (générique) |
| `4000 0000 0000 0341` | ❌ Carte attachée échoue |

**Date d'expiration :** N'importe quelle date future  
**CVC :** N'importe quel 3 chiffres  
**Code postal :** N'importe lequel

---

## 🔗 LIENS UTILES

- 📊 [Stripe Dashboard Test](https://dashboard.stripe.com/test/dashboard)
- 💳 [Paiements Test](https://dashboard.stripe.com/test/payments)
- 🔔 [Webhooks](https://dashboard.stripe.com/test/webhooks)
- 📦 [Produits](https://dashboard.stripe.com/test/products)
- 📝 [Docs Cartes de test](https://stripe.com/docs/testing)

---

## 🔧 CONFIGURATION WEBHOOK (PRODUCTION)

### Étapes pour configurer le webhook en production :

1. **Aller sur Stripe Dashboard**
   ```
   https://dashboard.stripe.com/webhooks
   ```

2. **Cliquer "Add endpoint"**

3. **URL du webhook :**
   ```
   https://votre-domaine.com/api/stripe/webhook
   ```

4. **Événements à écouter :**
   - ✅ `payment_intent.succeeded`
   - ✅ `invoice.paid`
   - ✅ `charge.refunded`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

5. **Copier le Webhook Secret**
   ```bash
   # Ajouter dans .env.local
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## 📝 SCÉNARIOS DE TEST COMPLETS

### Scénario 1 : Nouvel abonnement
1. Page de test → Cliquer "Starter"
2. Remplir avec carte `4242 4242 4242 4242`
3. ✅ Vérifier redirection vers `/billing?success=true`
4. ✅ Vérifier paiement dans Stripe Dashboard
5. ✅ Vérifier webhook reçu (si configuré)

### Scénario 2 : 3D Secure
1. Page de test → Cliquer "Pro"
2. Utiliser carte `4000 0025 0000 3155`
3. ✅ Modal 3D Secure s'affiche
4. ✅ Cliquer "Authorize test payment"
5. ✅ Paiement réussi

### Scénario 3 : Carte refusée
1. Page de test → Cliquer "Business"
2. Utiliser carte `4000 0000 0000 9995`
3. ✅ Message d'erreur affiché
4. ✅ Pas de paiement créé

### Scénario 4 : Annulation
1. Créer un abonnement (Scénario 1)
2. Aller sur `/billing`
3. Cliquer "Annuler l'abonnement"
4. ✅ Abonnement annulé dans Stripe
5. ✅ Webhook `customer.subscription.deleted` reçu

---

## 🐛 DÉPANNAGE

### Erreur : "STRIPE_SECRET_KEY is not configured"
```bash
# Vérifier que .env.local contient bien :
STRIPE_SECRET_KEY=sk_test_51Sj1j0PNU9Au1ZEM...
```

### Erreur : "Invalid API Key"
```bash
# Vérifier que vous utilisez bien une clé de test (commence par sk_test_)
# Les clés live commencent par sk_live_
```

### Webhook non reçu
```bash
# Option 1 : Utiliser Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Option 2 : Vérifier les logs
tail -f /tmp/next-dev.log | grep stripe
```

### Paiement bloqué en "processing"
```bash
# Vérifier dans Stripe Dashboard si le paiement est réellement traité
# Parfois un délai de quelques secondes est normal
```

---

## ✅ CHECKLIST FINALE

### Avant de passer en production :

- [ ] Tous les tests de paiement fonctionnent
- [ ] Webhooks testés avec Stripe CLI
- [ ] Gestion des erreurs testée
- [ ] Annulation d'abonnement testée
- [ ] Remplacer les clés de test par les clés de production
- [ ] Configurer le webhook en production
- [ ] Tester avec de vraies cartes (petits montants)
- [ ] Vérifier les emails de confirmation Stripe
- [ ] Configurer les emails personnalisés (optionnel)

---

## 🎉 RÉSULTAT ATTENDU

Après tous les tests, vous devriez avoir :

1. ✅ **Produits Stripe créés** et visibles dans le dashboard
2. ✅ **Page de test fonctionnelle** (`/stripe-test`)
3. ✅ **Paiements de test réussis** avec carte `4242...`
4. ✅ **Webhooks fonctionnels** (tracking des revenus)
5. ✅ **Gestion d'abonnements** (création, annulation)

---

**🚀 Prêt pour la production !**

Une fois tous les tests validés, vous pourrez :
1. Remplacer les clés de test par les clés live
2. Configurer le webhook en production
3. Activer les paiements réels

---

**Version :** 1.0  
**Date :** 27 Décembre 2024  
**Statut :** ✅ Tests en cours
