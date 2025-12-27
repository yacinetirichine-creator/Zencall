/**
 * Script pour créer les produits Stripe
 * Usage: npm run stripe:setup
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY n\'est pas défini dans .env.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

const PLANS = {
  starter: {
    name: 'Zencall Starter',
    description: '2 assistants IA, 1 numéro, 100 minutes incluses',
    price: 49,
    features: [
      '2 assistants IA',
      '1 numéro de téléphone',
      '100 minutes d\'appels',
      'Support email',
    ],
  },
  pro: {
    name: 'Zencall Pro',
    description: '5 assistants IA, 3 numéros, 500 minutes incluses',
    price: 99,
    features: [
      '5 assistants IA',
      '3 numéros de téléphone',
      '500 minutes d\'appels',
      'API REST & Webhooks',
      'Support prioritaire',
    ],
  },
  business: {
    name: 'Zencall Business',
    description: '10 assistants IA, 5 numéros, 2000 minutes incluses',
    price: 199,
    features: [
      '10 assistants IA',
      '5 numéros de téléphone',
      '2000 minutes d\'appels',
      'Campagnes automatisées',
      'Support dédié 24/7',
    ],
  },
};

async function setupStripeProducts() {
  console.log('🚀 Configuration des produits Stripe...\n');

  for (const [key, plan] of Object.entries(PLANS)) {
    try {
      console.log(`📦 Création du produit: ${plan.name}...`);

      // Créer le produit
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_type: key,
          features: plan.features.join(', '),
        },
      });

      console.log(`✅ Produit créé: ${product.id}`);

      // Créer le prix (abonnement mensuel)
      const price = await stripe.prices.create({
        product: product.id,
        currency: 'eur',
        unit_amount: plan.price * 100, // en centimes
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan_type: key,
        },
      });

      console.log(`✅ Prix créé: ${price.id} (${plan.price}€/mois)`);
      console.log(`   → ID Produit: ${product.id}`);
      console.log(`   → ID Prix: ${price.id}\n`);
    } catch (error: any) {
      console.error(`❌ Erreur pour ${plan.name}:`, error.message);
    }
  }

  console.log('\n✅ Configuration Stripe terminée !');
  console.log('\n📝 Prochaines étapes :');
  console.log('1. Notez les IDs des produits et prix ci-dessus');
  console.log('2. Allez sur https://dashboard.stripe.com/test/products');
  console.log('3. Vérifiez que les produits sont bien créés');
  console.log('4. Configurez les webhooks : https://dashboard.stripe.com/test/webhooks');
}

// Exécuter le script
setupStripeProducts().catch(console.error);
