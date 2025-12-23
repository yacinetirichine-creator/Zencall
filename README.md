# 🚀 Zencall

**Assistant téléphonique IA pour entreprises** - Plateforme SaaS de téléphonie cloud avec IA conversationnelle.

## ✨ Fonctionnalités

- 🤖 **Assistants IA** - Conversations naturelles multilingues (FR, ES, EN, NL, AR)
- 📞 **Astreinte 24/7** - Ne manquez plus jamais un appel important
- 📅 **Prise de RDV** - Synchronisation automatique avec calendriers
- 📊 **Analytics** - Tableau de bord complet avec transcriptions
- 📢 **Campagnes** - Appels sortants automatisés
- 🔌 **API REST** - Intégration avec vos outils

## 🛠 Stack technique

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Téléphonie IA**: Vapi.ai
- **Déploiement**: Vercel

## 📦 Installation

```bash
# Cloner le projet
git clone <repo>
cd zencall

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Lancer en développement
npm run dev
```

## ⚙️ Configuration

### Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter la migration: `supabase/migrations/001_initial_schema.sql`
3. Copier les clés dans `.env.local`

### Vapi.ai

1. Créer un compte sur [vapi.ai](https://vapi.ai)
2. Créer une clé API
3. Configurer le webhook URL: `https://votre-domaine.com/api/vapi/webhook`

## 📁 Structure

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Pages du tableau de bord
│   └── api/               # Routes API
├── components/
│   ├── ui/                # Composants réutilisables
│   ├── layout/            # Layout components
│   └── dashboard/         # Composants du dashboard
├── hooks/                 # React hooks personnalisés
├── lib/                   # Utilitaires et clients
│   ├── supabase/         # Client Supabase
│   └── vapi/             # Client Vapi
└── types/                 # Types TypeScript
```

## 🎨 Design System

Palette de couleurs Zencall:
- **Coral** (primaire): #FFBCBC, #FF6B6B
- **Blue** (secondaire): #7EC8E3, #2196C5
- **Mint** (succès): #98D7C2, #3EB98C
- **Lavender** (accent): #B8A9C9

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

---

Développé avec ❤️ pour révolutionner la téléphonie d'entreprise.
