import Stripe from 'stripe';

/**
 * Singleton Stripe client
 * Utilisé pour toutes les opérations Stripe
 */
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  
  return stripeClient;
}

/**
 * Plans Zencall disponibles
 */
export const ZENCALL_PLANS = {
  starter: {
    name: 'Starter',
    price: 49, // EUR
    minutes: 100,
    features: [
      '2 assistants IA',
      '1 numéro de téléphone',
      '100 minutes d\'appels incluses',
      'Support email',
      'Dashboard analytics',
    ],
  },
  pro: {
    name: 'Pro',
    price: 99,
    minutes: 500,
    features: [
      '5 assistants IA',
      '3 numéros de téléphone',
      '500 minutes d\'appels incluses',
      'API REST & Webhooks',
      'Intégrations avancées',
      'Support prioritaire',
    ],
  },
  business: {
    name: 'Business',
    price: 199,
    minutes: 2000,
    features: [
      '10 assistants IA',
      '5 numéros de téléphone',
      '2000 minutes d\'appels incluses',
      'Campagnes automatisées',
      'Multi-utilisateurs',
      'Support dédié 24/7',
      'SLA garanti',
    ],
  },
} as const;

export type PlanType = keyof typeof ZENCALL_PLANS;

/**
 * Créer une session de checkout Stripe
 */
export async function createCheckoutSession(params: {
  planType: PlanType;
  userId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  const plan = ZENCALL_PLANS[params.planType];
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Zencall ${plan.name}`,
            description: `${plan.minutes} minutes d'appels incluses`,
          },
          unit_amount: plan.price * 100, // en centimes
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      user_id: params.userId,
      plan_type: params.planType,
    },
    subscription_data: {
      metadata: {
        user_id: params.userId,
        plan_type: params.planType,
      },
    },
  });
  
  return session;
}

/**
 * Récupérer une session de checkout
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  return await stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Annuler un abonnement
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Mettre à jour un abonnement
 */
export async function updateSubscription(
  subscriptionId: string,
  newPlanType: PlanType
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient();
  const plan = ZENCALL_PLANS[newPlanType];
  
  // Récupérer l'abonnement actuel
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Créer le nouveau prix
  const price = await stripe.prices.create({
    currency: 'eur',
    unit_amount: plan.price * 100,
    recurring: {
      interval: 'month',
    },
    product_data: {
      name: `Zencall ${plan.name}`,
    },
  });
  
  // Mettre à jour l'abonnement
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: price.id,
      },
    ],
    metadata: {
      plan_type: newPlanType,
    },
  });
}

export { Stripe };
