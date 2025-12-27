#!/bin/bash

# 🚀 Script de déploiement rapide Zencall
# Usage: ./scripts/quick-deploy.sh

set -e  # Exit on error

echo "🚀 ZENCALL - Déploiement rapide"
echo "================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifications préalables
echo "📋 Vérifications préalables..."

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI n'est pas installé${NC}"
    echo "   Installation : npm i -g vercel"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI trouvé${NC}"
echo -e "${GREEN}✅ Node.js trouvé${NC}"
echo ""

# Build local
echo "🔨 Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Le build a échoué${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build réussi${NC}"
echo ""

# Vérification des variables d'environnement critiques
echo "🔐 Vérification des variables d'environnement..."

REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "VAPI_API_KEY"
    "NEXT_PUBLIC_VAPI_PUBLIC_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Variables manquantes dans .env.local :${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Ces variables seront nécessaires sur Vercel."
    echo ""
fi

# Confirmation
echo ""
echo -e "${YELLOW}❓ Prêt à déployer sur Vercel ?${NC}"
echo "   Cela va :"
echo "   1. Pousser le code sur Vercel"
echo "   2. Créer un déploiement de production"
echo "   3. Générer une URL publique"
echo ""
read -p "Continuer ? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Déploiement annulé."
    exit 0
fi

# Déploiement
echo ""
echo "🚀 Déploiement sur Vercel..."
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI !${NC}"
    echo ""
    echo "📝 Prochaines étapes :"
    echo "   1. Configurer les variables d'environnement sur Vercel"
    echo "   2. Configurer les webhooks VAPI avec votre URL"
    echo "   3. Tester l'inscription et la connexion"
    echo ""
    echo "📚 Documentation : READY_TO_LAUNCH.md"
else
    echo ""
    echo -e "${RED}❌ Le déploiement a échoué${NC}"
    exit 1
fi
