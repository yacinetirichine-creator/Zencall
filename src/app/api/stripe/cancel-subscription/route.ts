import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';

/**
 * POST /api/stripe/cancel-subscription
 * Annuler un abonnement Stripe
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Récupérer l'abonnement actif de l'utilisateur
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (!subscription || !subscription.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    // Annuler l'abonnement sur Stripe
    const stripe = getStripeClient();
    const canceledSubscription = await stripe.subscriptions.cancel(
      subscription.stripe_subscription_id
    );
    
    // Mettre à jour dans la base de données
    await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id);
    
    return NextResponse.json({
      success: true,
      subscription: canceledSubscription,
    });
    
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
