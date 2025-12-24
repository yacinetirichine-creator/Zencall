#!/bin/bash

# Script de déploiement automatisé pour Zencall
# Usage: ./scripts/deploy.sh [staging|production]

set -e  # Exit on error

ENVIRONMENT=${1:-staging}
echo "🚀 Déploiement Zencall - Environnement: $ENVIRONMENT"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de logging
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Étape 1: Vérifications pré-déploiement
echo ""
echo "📋 Vérifications pré-déploiement..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé"
    exit 1
fi
log_info "Node.js $(node --version)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé"
    exit 1
fi
log_info "npm $(npm --version)"

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    log_warn "node_modules manquant, installation..."
    npm install
fi
log_info "Dépendances installées"

# Vérifier les variables d'environnement
if [ ! -f ".env.local" ] && [ "$ENVIRONMENT" = "staging" ]; then
    log_error "Fichier .env.local manquant"
    exit 1
fi

# Étape 2: Tests
echo ""
echo "🧪 Exécution des tests..."

# Build test
log_info "Test de build..."
npm run build || {
    log_error "Le build a échoué"
    exit 1
}
log_info "Build réussi"

# Type checking
log_info "Vérification des types TypeScript..."
npx tsc --noEmit || {
    log_warn "Erreurs TypeScript détectées (non bloquant)"
}

# Étape 3: Déploiement Vercel
echo ""
echo "🌐 Déploiement sur Vercel..."

if ! command -v vercel &> /dev/null; then
    log_warn "Vercel CLI non installé, installation..."
    npm i -g vercel
fi

# Déployer selon l'environnement
if [ "$ENVIRONMENT" = "production" ]; then
    log_info "Déploiement en PRODUCTION..."
    vercel --prod
else
    log_info "Déploiement en STAGING..."
    vercel
fi

# Récupérer l'URL de déploiement
DEPLOY_URL=$(vercel ls --limit 1 | grep -oP 'https://\S+' | head -1)

if [ -z "$DEPLOY_URL" ]; then
    log_warn "Impossible de récupérer l'URL de déploiement"
else
    log_info "URL de déploiement: $DEPLOY_URL"
fi

# Étape 4: Post-déploiement
echo ""
echo "✅ Post-déploiement..."

# Afficher les actions manuelles nécessaires
echo ""
echo "📝 Actions manuelles requises:"
echo "1. Exécuter la migration 004 dans Supabase Dashboard"
echo "2. Configurer le webhook VAPI: $DEPLOY_URL/api/vapi/webhook"
echo "3. Tester l'inscription: $DEPLOY_URL/register-new"
echo "4. Vérifier les pages légales: $DEPLOY_URL/legal/privacy"
echo "5. Tester la configuration Twilio dans Settings"

# Étape 5: Checklist
echo ""
echo "✓ Checklist de vérification:"
echo "  [ ] Migration 004 exécutée dans Supabase"
echo "  [ ] Variables d'environnement configurées sur Vercel"
echo "  [ ] Webhook VAPI configuré"
echo "  [ ] Test d'inscription B2B"
echo "  [ ] Test d'inscription B2C"
echo "  [ ] Configuration Twilio testée"
echo "  [ ] Pages légales accessibles"

echo ""
log_info "Déploiement terminé avec succès!"
echo ""
