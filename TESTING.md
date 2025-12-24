# 🧪 Guide de Tests - Zencall

## Tests Manuels Post-Déploiement

### 1. Test d'Inscription B2B

**Objectif** : Vérifier que l'inscription entreprise fonctionne avec RGPD

**Étapes** :
1. Aller sur `https://votre-app.vercel.app/register-new`
2. Cliquer sur "Entreprise (B2B)"
3. Remplir le formulaire :
   ```
   Nom complet: Jean Dupont
   Email: jean.dupont@test-company.fr
   Mot de passe: TestPass123!
   Confirmer: TestPass123!
   Nom entreprise: Test Company SARL
   SIRET: 123 456 789 00010
   Numéro TVA: FR12345678901
   ```
4. Cocher :
   - [x] J'accepte les CGU
   - [x] J'accepte la politique de confidentialité
   - [x] J'accepte les communications marketing (optionnel)
5. Cliquer sur "Créer mon compte"

**Résultats attendus** :
- ✅ Redirection vers `/register/success`
- ✅ Email de confirmation reçu
- ✅ Dans Supabase, vérifier :
  ```sql
  SELECT * FROM organizations WHERE name = 'Test Company SARL';
  -- organization_type doit être 'b2b'
  
  SELECT * FROM profiles WHERE email = 'jean.dupont@test-company.fr';
  -- role doit être 'admin'
  
  SELECT * FROM gdpr_consents WHERE user_id = '...';
  -- Doit avoir 3 consentements (terms, privacy, marketing)
  
  SELECT * FROM gdpr_audit_logs WHERE action = 'account_created';
  -- Doit avoir une entrée
  ```

### 2. Test d'Inscription B2C

**Objectif** : Vérifier l'inscription particulier

**Étapes** :
1. Aller sur `/register-new`
2. Cliquer sur "Particulier (B2C)"
3. Remplir le formulaire :
   ```
   Nom complet: Marie Martin
   Email: marie.martin@test-perso.fr
   Mot de passe: TestPass456!
   Confirmer: TestPass456!
   ```
4. Cocher :
   - [x] J'accepte les CGU
   - [x] J'accepte la politique de confidentialité
5. Cliquer sur "Créer mon compte"

**Résultats attendus** :
- ✅ Redirection vers `/register/success`
- ✅ Email de confirmation reçu
- ✅ Dans Supabase :
  ```sql
  SELECT * FROM organizations WHERE name LIKE '%Marie Martin%';
  -- organization_type doit être 'b2c'
  -- company_registration et vat_number doivent être NULL
  ```

### 3. Test de Connexion

**Étapes** :
1. Cliquer sur le lien dans l'email de confirmation
2. Aller sur `/login`
3. Entrer les credentials :
   ```
   Email: jean.dupont@test-company.fr
   Mot de passe: TestPass123!
   ```
4. Cliquer sur "Se connecter"

**Résultats attendus** :
- ✅ Redirection vers `/dashboard`
- ✅ Nom affiché dans le header
- ✅ Dashboard avec stats (0 appels, 0 assistants, etc.)

### 4. Test Configuration Twilio

**Objectif** : Vérifier le stockage multi-tenant des credentials Twilio

**Étapes** :
1. Se connecter avec un compte
2. Aller dans "Settings" > "Integrations"
3. Remplir les champs Twilio :
   ```
   Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Auth Token: your_auth_token_here
   Phone Number: +33612345678
   ```
4. Cliquer sur "Sauvegarder"

**Résultats attendus** :
- ✅ Message de succès "Configuration Twilio sauvegardée"
- ✅ Dans Supabase :
  ```sql
  SELECT 
    twilio_account_sid, 
    twilio_phone_number, 
    twilio_configured,
    twilio_auth_token_encrypted IS NOT NULL as token_encrypted
  FROM organizations 
  WHERE id = 'votre_org_id';
  
  -- twilio_configured doit être TRUE
  -- token_encrypted doit être TRUE (vérifie que le token est bien chiffré)
  ```
5. Tester l'envoi d'un SMS (bouton "Tester")

### 5. Test Création d'Assistant

**Objectif** : Vérifier la synchronisation avec VAPI

**Étapes** :
1. Aller dans "Assistants"
2. Cliquer sur "Nouvel Assistant"
3. Remplir :
   ```
   Nom: Assistant Support
   Modèle: gpt-4
   Voix: jennifer
   Prompt: Tu es un assistant de support client...
   ```
4. Cliquer sur "Créer"

**Résultats attendus** :
- ✅ Assistant créé dans la liste
- ✅ Dans VAPI Dashboard, l'assistant apparaît
- ✅ Dans Supabase :
  ```sql
  SELECT * FROM assistants WHERE name = 'Assistant Support';
  -- vapi_assistant_id doit être rempli
  -- organization_id doit correspondre
  ```

### 6. Test Campagne

**Objectif** : Vérifier le système de campagnes automatisées

**Prérequis** :
- Twilio configuré
- Au moins 1 assistant créé
- Contacts dans la DB

**Étapes** :
1. Aller dans "Campaigns"
2. Cliquer sur "Nouvelle Campagne"
3. Remplir :
   ```
   Nom: Campagne Test
   Assistant: Assistant Support
   Contacts: Sélectionner quelques contacts
   Horaire: 09:00 - 18:00
   Tentatives max: 3
   ```
4. Cliquer sur "Lancer la campagne"

**Résultats attendus** :
- ✅ Campagne apparaît dans la liste avec statut "active"
- ✅ Les appels sont programmés et exécutés
- ✅ Dans Supabase :
  ```sql
  SELECT * FROM campaigns WHERE name = 'Campagne Test';
  
  SELECT * FROM campaign_calls WHERE campaign_id = '...';
  -- Doit avoir des entrées pour chaque contact
  ```

### 7. Test Webhook VAPI

**Objectif** : Vérifier la réception des événements VAPI

**Étapes** :
1. Dans VAPI Dashboard, aller dans Settings > Webhooks
2. Vérifier l'URL : `https://votre-app.vercel.app/api/vapi/webhook`
3. Faire un appel test avec un assistant
4. Observer les logs

**Test manuel avec curl** :
```bash
curl -X POST https://votre-app.vercel.app/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call-started",
    "call": {
      "id": "test-call-123",
      "assistantId": "votre-assistant-id",
      "customer": {
        "number": "+33612345678"
      }
    }
  }'
```

**Résultats attendus** :
- ✅ Réponse HTTP 200
- ✅ Dans Supabase :
  ```sql
  SELECT * FROM calls WHERE vapi_call_id = 'test-call-123';
  -- Doit avoir une entrée avec status 'in_progress'
  ```

### 8. Test RGPD - Export de données

**Objectif** : Vérifier le système de demandes RGPD

**Étapes** :
1. Se connecter avec un compte
2. Aller dans "Settings" > "GDPR"
3. Cliquer sur "Exporter mes données"
4. Confirmer la demande

**Résultats attendus** :
- ✅ Message "Demande d'export créée"
- ✅ Dans Supabase :
  ```sql
  SELECT * FROM gdpr_requests 
  WHERE user_id = '...' AND request_type = 'data_export';
  -- status doit être 'pending'
  
  SELECT * FROM gdpr_audit_logs 
  WHERE action = 'data_export_requested';
  ```
5. (Après traitement manuel) Vérifier que le lien de téléchargement apparaît

### 9. Test RGPD - Suppression de compte

**Objectif** : Vérifier la demande de suppression

**Étapes** :
1. Aller dans "Settings" > "GDPR"
2. Cliquer sur "Supprimer mon compte"
3. Confirmer (avec alerte)

**Résultats attendus** :
- ✅ Demande créée
- ✅ Dans Supabase :
  ```sql
  SELECT * FROM gdpr_requests 
  WHERE user_id = '...' AND request_type = 'data_deletion';
  ```

### 10. Test Pages Légales

**Objectif** : Vérifier l'accessibilité des pages RGPD

**Étapes** :
1. Aller sur `/legal/privacy`
2. Vérifier que la politique de confidentialité s'affiche
3. Aller sur `/legal/terms`
4. Vérifier que les CGU s'affichent

**Résultats attendus** :
- ✅ Pages complètes avec texte légal en français
- ✅ Sections bien formatées
- ✅ Liens fonctionnels

## Tests d'Intégration

### Test E2E Complet

**Scénario** : Nouveau client B2B s'inscrit et lance une campagne

1. **Inscription**
   - Aller sur `/register-new`
   - Choisir B2B
   - Remplir formulaire complet
   - Accepter RGPD
   - Valider email

2. **Configuration**
   - Se connecter
   - Aller dans Settings > Integrations
   - Configurer Twilio
   - Tester la connexion

3. **Création Assistant**
   - Aller dans Assistants
   - Créer un assistant
   - Vérifier la sync VAPI

4. **Campagne**
   - Aller dans Campaigns
   - Créer une campagne
   - Lancer la campagne
   - Vérifier les appels

5. **Monitoring**
   - Vérifier le dashboard
   - Voir les stats en temps réel
   - Consulter l'historique

**Durée estimée** : 15-20 minutes

## Tests de Sécurité

### Test RLS (Row Level Security)

**Objectif** : Vérifier qu'un utilisateur ne peut pas voir les données d'une autre organisation

**Étapes** :
1. Créer 2 comptes dans 2 organisations différentes
2. Créer un assistant dans Org A
3. Se connecter avec le compte Org B
4. Essayer d'accéder à l'assistant de Org A

**Résultats attendus** :
- ✅ L'assistant de Org A n'apparaît PAS dans la liste de Org B
- ✅ Tentative d'accès direct retourne 404/403

### Test XSS

**Objectif** : Vérifier la sanitization des inputs

**Étapes** :
1. Essayer de créer un assistant avec un nom :
   ```
   <script>alert('XSS')</script>
   ```

**Résultats attendus** :
- ✅ Pas d'exécution de script
- ✅ Nom affiché échappé

## Checklist Finale

Avant de marquer comme "Production-Ready" :

- [ ] ✅ Test inscription B2B réussi
- [ ] ✅ Test inscription B2C réussi
- [ ] ✅ Email de confirmation fonctionne
- [ ] ✅ Connexion fonctionne
- [ ] ✅ Configuration Twilio multi-tenant OK
- [ ] ✅ Création assistant + sync VAPI OK
- [ ] ✅ Webhooks VAPI configurés et fonctionnels
- [ ] ✅ Campagne démarre et exécute les appels
- [ ] ✅ Dashboard temps réel fonctionne
- [ ] ✅ Pages légales accessibles
- [ ] ✅ Export RGPD fonctionne
- [ ] ✅ Demande suppression fonctionne
- [ ] ✅ RLS testé et valide
- [ ] ✅ Headers de sécurité vérifiés
- [ ] ✅ Performance acceptable (< 2s chargement)
- [ ] ✅ Responsive mobile OK

## Outils de Test

### Postman Collection

```json
{
  "info": {
    "name": "Zencall API Tests"
  },
  "item": [
    {
      "name": "Register B2B",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@company.com\",\n  \"password\": \"Test123!\",\n  \"fullName\": \"Test User\",\n  \"organizationType\": \"b2b\",\n  \"companyName\": \"Test Company\",\n  \"termsAccepted\": true,\n  \"privacyAccepted\": true\n}"
        }
      }
    }
  ]
}
```

### Scripts de Test

```bash
# Test webhook VAPI
./scripts/test-vapi-webhook.sh

# Test Twilio
./scripts/test-twilio.sh

# Test complet E2E
./scripts/test-e2e.sh
```

---

**Note** : Tous les tests doivent passer avant la mise en production !
