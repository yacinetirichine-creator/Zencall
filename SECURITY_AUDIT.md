# 🔒 Analyse de Sécurité - Zencall

**Date** : 23 Décembre 2025  
**Version** : 1.0  
**Statut** : Développement

---

## 📊 Score Global de Sécurité : 6.5/10

### Résumé Exécutif

L'application Zencall présente une base solide avec Row Level Security (RLS) activée, mais comporte **plusieurs vulnérabilités critiques** qui doivent être corrigées avant le déploiement en production.

---

## 🚨 VULNÉRABILITÉS CRITIQUES (Priorité 1)

### 1. **Webhook VAPI Non Sécurisé** ⚠️ CRITIQUE
**Fichier** : `/src/app/api/vapi/webhook/route.ts`

**Problème** :
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json(); // Aucune vérification de signature
  // Traitement direct sans authentification
}
```

**Impact** : N'importe qui peut envoyer de fausses données et :
- Créer de faux appels dans votre base
- Modifier les statistiques
- Injecter du contenu malveillant

**Solution** :
```typescript
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  // 1. Vérifier la signature VAPI
  const signature = request.headers.get('x-vapi-signature');
  const timestamp = request.headers.get('x-vapi-timestamp');
  const body = await request.text();
  
  // 2. Valider le timestamp (max 5 min)
  if (Math.abs(Date.now() - parseInt(timestamp)) > 300000) {
    return NextResponse.json({ error: 'Request too old' }, { status: 401 });
  }
  
  // 3. Vérifier la signature HMAC
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(timestamp + body)
    .digest('hex');
    
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const data = JSON.parse(body);
  // Traitement sécurisé...
}
```

---

### 2. **Validation API Key Insuffisante** ⚠️ CRITIQUE
**Fichier** : `/src/app/api/v1/assistants/route.ts`

**Problème** :
```typescript
async function validateApiKey(request: NextRequest) {
  const key = authHeader.slice(7);
  // Compare seulement le préfixe (10 caractères) !
  const { data } = await supabase
    .from("api_keys")
    .select("organization_id")
    .eq("key_prefix", key.slice(0, 10)) // DANGER !
}
```

**Impact** :
- N'importe quelle clé commençant par les 10 mêmes caractères est acceptée
- Collision facile (seulement 36^10 possibilités)
- Pas de hashage de la clé

**Solution** :
```typescript
import bcrypt from 'bcrypt';

async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  
  const apiKey = authHeader.slice(7);
  const prefix = apiKey.slice(0, 10);
  
  const supabase = await createAdminClient();
  
  // 1. Récupérer par préfixe
  const { data: keys } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key_prefix", prefix)
    .eq("is_active", true);
  
  if (!keys || keys.length === 0) return null;
  
  // 2. Vérifier le hash complet
  for (const key of keys) {
    const isValid = await bcrypt.compare(apiKey, key.key_hash);
    if (isValid) {
      // 3. Mettre à jour last_used
      await supabase
        .from("api_keys")
        .update({ 
          last_used_at: new Date().toISOString(),
          usage_count: key.usage_count + 1,
          last_used_ip: request.ip
        })
        .eq("id", key.id);
      
      return key.organization_id;
    }
  }
  
  return null;
}
```

---

### 3. **Fichier .env.local Exposé** ⚠️ CRITIQUE
**Fichier** : `.gitignore`

**Problème** :
```ignore
node_modules
# C'est TOUT ! .env.local n'est PAS ignoré !
```

**Impact** :
- Les clés secrètes peuvent être commitées par erreur
- Exposition de `SUPABASE_SERVICE_ROLE_KEY`
- Exposition de clés Stripe, VAPI, etc.

**Solution** :
```ignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Env files - CRITIQUE !
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Misc
*.pem
```

---

## ⚠️ VULNÉRABILITÉS IMPORTANTES (Priorité 2)

### 4. **Pas de Rate Limiting**
**Impact** : Attaques DDoS possibles sur :
- Routes API `/api/v1/*`
- Webhook VAPI
- Authentification

**Solution** : Implémenter rate limiting avec Vercel Edge Config ou Redis

### 5. **Pas de Validation des Entrées**
**Problème** : 
```typescript
const body = await request.json();
// Aucune validation avec Zod ou autre
await supabase.from("assistants").insert({ ...body, organization_id: orgId });
```

**Impact** : Injection de données malveillantes

**Solution** :
```typescript
import { z } from 'zod';

const createAssistantSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['astreinte', 'rdv', 'info', 'outbound']),
  language: z.enum(['fr', 'es', 'en', 'nl', 'ar']),
  system_prompt: z.string().max(5000).optional(),
  // ...
});

const body = createAssistantSchema.parse(await request.json());
```

### 6. **Credentials OAuth en Texte Clair**
**Table** : `integrations`
**Champ** : `access_token`, `refresh_token`

**Problème** : Tokens OAuth stockés en texte clair

**Solution** : Chiffrement avec KMS (AWS KMS, Google Cloud KMS, ou Supabase Vault)

### 7. **Pas de HTTPS Forcé**
**Problème** : Pas de redirection HTTP → HTTPS dans le middleware

**Solution** :
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Force HTTPS en production
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.url}`,
      301
    );
  }
  
  return await updateSession(request);
}
```

---

## ✅ POINTS POSITIFS

1. ✅ **Row Level Security (RLS)** activé sur toutes les tables
2. ✅ **Policies Supabase** bien configurées avec `auth.uid()`
3. ✅ **Séparation des rôles** (super_admin, org_admin, user)
4. ✅ **Audit Logs** implémentés
5. ✅ **Triggers automatiques** pour updated_at
6. ✅ **Middleware d'authentification** Next.js
7. ✅ **TypeScript** pour la sécurité des types
8. ✅ **Foreign Keys** avec CASCADE appropriés

---

## 📋 RECOMMANDATIONS ADDITIONNELLES

### Sécurité Générale
- [ ] Implémenter CSP (Content Security Policy)
- [ ] Ajouter des headers de sécurité (HSTS, X-Frame-Options, etc.)
- [ ] Activer CORS avec whitelist stricte
- [ ] Implémenter 2FA pour les admin

### Monitoring & Logging
- [ ] Logger toutes les tentatives d'authentification échouées
- [ ] Alertes sur activités suspectes
- [ ] Intégration Sentry pour erreurs
- [ ] Dashboard de sécurité temps réel

### Données Sensibles
- [ ] Chiffrer les transcriptions d'appels
- [ ] Anonymiser les données de test
- [ ] Politique de rétention des données
- [ ] RGPD : Droit à l'oubli

### API Security
- [ ] Versioning API (`/v1`, `/v2`)
- [ ] Documentation OpenAPI/Swagger
- [ ] Rotation automatique des API keys
- [ ] Limites de taux par organisation

---

## 🛠️ PROCHAINES ÉTAPES RECOMMANDÉES

### Phase 1 : Corrections Critiques (Cette semaine)
1. ✅ Sécuriser le webhook VAPI (signature HMAC)
2. ✅ Corriger la validation des API keys (bcrypt)
3. ✅ Mettre à jour `.gitignore`
4. ✅ Ajouter validation Zod sur toutes les routes API

### Phase 2 : Sécurité Renforcée (Semaine prochaine)
5. ⚠️ Implémenter rate limiting
6. ⚠️ Chiffrer les tokens OAuth
7. ⚠️ Forcer HTTPS en production
8. ⚠️ Ajouter headers de sécurité

### Phase 3 : Monitoring & Compliance (2 semaines)
9. 📊 Intégrer Sentry
10. 📊 Tableau de bord sécurité
11. 📊 Audit de conformité RGPD
12. 📊 Tests de pénétration

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [RGPD Compliance](https://www.cnil.fr/)

---

**Dernière mise à jour** : 23 Décembre 2025  
**Prochaine révision** : Après corrections critiques
