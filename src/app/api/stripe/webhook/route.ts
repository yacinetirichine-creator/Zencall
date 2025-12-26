import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for:
 * - Payment success (revenue tracking)
 * - Refunds (revenue adjustment)
 * - Subscription events
 * - Invoice payments
 * 
 * Setup:
 * 1. Go to https://dashboard.stripe.com/webhooks
 * 2. Add endpoint: https://zen-call.net/api/stripe/webhook
 * 3. Select events: payment_intent.succeeded, invoice.paid, charge.refunded
 * 4. Copy webhook secret to STRIPE_WEBHOOK_SECRET env var
 */

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  
  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  console.log(`Received Stripe event: ${event.type}`);
  
  try {
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
        
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(payment: Stripe.PaymentIntent) {
  console.log('Processing payment success:', payment.id);
  
  // Extract metadata
  const userId = payment.metadata.user_id;
  const planType = payment.metadata.plan_type || 'unknown';
  const billingPeriod = payment.metadata.billing_period || 'monthly';
  
  if (!userId) {
    console.warn('Payment without user_id:', payment.id);
    return;
  }
  
  // Track revenue
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/revenue/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      transaction_type: 'subscription',
      amount_cents: payment.amount,
      currency: payment.currency.toUpperCase(),
      stripe_payment_id: payment.id,
      stripe_invoice_id: payment.invoice as string || null,
      plan_type: planType,
      billing_period: billingPeriod,
      description: `${planType} plan - ${billingPeriod} billing`,
      metadata: {
        customer_email: payment.receipt_email,
        payment_method: payment.payment_method,
      },
      api_key: process.env.REVENUE_TRACKING_API_KEY,
    }),
  });
  
  if (!response.ok) {
    console.error('Failed to track revenue:', await response.text());
  } else {
    console.log('Revenue tracked successfully for payment:', payment.id);
  }
}

/**
 * Handle invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment:', invoice.id);
  
  const userId = invoice.metadata.user_id || invoice.customer as string;
  
  // Track revenue
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/revenue/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      transaction_type: invoice.billing_reason === 'subscription_create' ? 'subscription' : 'overage',
      amount_cents: invoice.amount_paid,
      currency: invoice.currency.toUpperCase(),
      stripe_payment_id: invoice.payment_intent as string || null,
      stripe_invoice_id: invoice.id,
      plan_type: invoice.lines.data[0]?.price?.metadata?.plan_type || 'unknown',
      billing_period: invoice.lines.data[0]?.price?.recurring?.interval || 'monthly',
      description: `Invoice ${invoice.number}`,
      metadata: {
        invoice_number: invoice.number,
        customer_email: invoice.customer_email,
      },
      api_key: process.env.REVENUE_TRACKING_API_KEY,
    }),
  });
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  console.log('Processing refund:', charge.id);
  
  const userId = charge.metadata.user_id || charge.customer as string;
  
  // Track negative revenue (refund)
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/revenue/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      transaction_type: 'refund',
      amount_cents: -charge.amount_refunded, // Negative amount
      currency: charge.currency.toUpperCase(),
      stripe_payment_id: charge.payment_intent as string || null,
      description: `Refund for ${charge.id}`,
      metadata: {
        refund_reason: charge.refunds?.data[0]?.reason || 'requested_by_customer',
      },
      api_key: process.env.REVENUE_TRACKING_API_KEY,
    }),
  });
}

/**
 * Handle subscription creation or update
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing subscription change:', subscription.id);
  
  // You can add custom logic here, e.g.:
  // - Update user's plan in database
  // - Send welcome email for new subscriptions
  // - Log plan changes for analytics
  
  const planType = subscription.items.data[0]?.price?.metadata?.plan_type || 'unknown';
  const billingPeriod = subscription.items.data[0]?.price?.recurring?.interval || 'month';
  
  console.log(`Subscription ${subscription.id} updated to ${planType} (${billingPeriod})`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  console.log('Processing subscription cancellation:', subscription.id);
  
  // You can add custom logic here, e.g.:
  // - Update user's plan to free tier
  // - Send cancellation survey
  // - Schedule data deletion if required
  
  console.log(`Subscription ${subscription.id} cancelled`);
}
