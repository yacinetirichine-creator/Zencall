import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/revenue/track
 * 
 * Track a new revenue transaction
 * Called by Stripe webhooks or manually by admin
 */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Parse request body
    const body = await request.json();
    
    const {
      user_id,
      transaction_type,
      amount_cents,
      currency = 'EUR',
      stripe_payment_id,
      stripe_invoice_id,
      plan_type,
      billing_period,
      description,
      metadata,
      api_key,
    } = body;
    
    // Validate required fields
    if (!user_id || !transaction_type || !amount_cents) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, transaction_type, amount_cents' },
        { status: 400 }
      );
    }
    
    // Validate API key (for webhook authentication)
    const expectedApiKey = process.env.REVENUE_TRACKING_API_KEY;
    if (expectedApiKey && api_key !== expectedApiKey) {
      // Try to verify user is admin
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
    }
    
    // Validate transaction type
    const validTypes = ['subscription', 'overage', 'refund', 'credit'];
    if (!validTypes.includes(transaction_type)) {
      return NextResponse.json(
        { error: 'Invalid transaction_type. Must be: subscription, overage, refund, or credit' },
        { status: 400 }
      );
    }
    
    // Insert revenue record
    const { data, error } = await supabase
      .from('revenue_transactions')
      .insert({
        user_id,
        transaction_type,
        amount_cents,
        currency,
        stripe_payment_id: stripe_payment_id || null,
        stripe_invoice_id: stripe_invoice_id || null,
        plan_type: plan_type || null,
        billing_period: billing_period || null,
        description: description || null,
        metadata: metadata || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error tracking revenue:', error);
      return NextResponse.json(
        { error: 'Failed to track revenue', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        transaction: data,
        message: 'Revenue tracked successfully',
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error in revenue tracking endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/revenue?days=30&plan_type=professional
 * 
 * Get revenue records with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');
    const planType = searchParams.get('plan_type');
    const transactionType = searchParams.get('transaction_type');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Build query
    let query = supabase
      .from('revenue_transactions')
      .select('*')
      .gte('transaction_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    if (planType) {
      query = query.eq('plan_type', planType);
    }
    
    if (transactionType) {
      query = query.eq('transaction_type', transactionType);
    }
    
    const { data: transactions, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch revenue' },
        { status: 500 }
      );
    }
    
    // Calculate totals
    const total = transactions?.reduce((sum, t) => sum + t.amount_cents, 0) || 0;
    const subscriptions = transactions?.filter(t => t.transaction_type === 'subscription').reduce((sum, t) => sum + t.amount_cents, 0) || 0;
    const refunds = transactions?.filter(t => t.transaction_type === 'refund').reduce((sum, t) => sum + t.amount_cents, 0) || 0;
    
    // Group by plan type
    const byPlan: Record<string, number> = {};
    transactions?.forEach(t => {
      if (t.plan_type) {
        byPlan[t.plan_type] = (byPlan[t.plan_type] || 0) + t.amount_cents;
      }
    });
    
    return NextResponse.json({
      success: true,
      count: transactions?.length || 0,
      total_cents: total,
      subscriptions_cents: subscriptions,
      refunds_cents: refunds,
      net_revenue_cents: total - Math.abs(refunds),
      by_plan: byPlan,
      transactions,
    });
    
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
