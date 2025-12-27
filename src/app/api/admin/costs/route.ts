import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/costs/track
 * 
 * Track a new cost entry
 * Called by webhooks from Vapi, Twilio, etc. or manually by admin
 */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Parse request body
    const body = await request.json();
    
    const {
      cost_type,
      provider,
      amount_cents,
      currency = 'EUR',
      user_id,
      call_id,
      resource_id,
      quantity,
      unit,
      unit_price_cents,
      description,
      metadata,
      api_key,
    } = body;
    
    // Validate required fields
    if (!cost_type || !provider || !amount_cents) {
      return NextResponse.json(
        { error: 'Missing required fields: cost_type, provider, amount_cents' },
        { status: 400 }
      );
    }
    
    // Validate API key (for webhook authentication)
    const expectedApiKey = process.env.COST_TRACKING_API_KEY;
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
    
    // Insert cost record
    const { data, error } = await supabase
      .from('cost_tracking')
      .insert({
        cost_type,
        provider,
        amount_cents,
        currency,
        user_id: user_id || null,
        call_id: call_id || null,
        resource_id: resource_id || null,
        quantity: quantity || null,
        unit: unit || null,
        unit_price_cents: unit_price_cents || null,
        description: description || null,
        metadata: metadata || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error tracking cost:', error);
      return NextResponse.json(
        { error: 'Failed to track cost', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        cost: data,
        message: 'Cost tracked successfully',
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error in cost tracking endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/costs?days=30&provider=vapi
 * 
 * Get cost records with filtering
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
    const provider = searchParams.get('provider');
    const costType = searchParams.get('cost_type');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Build query
    let query = supabase
      .from('cost_tracking')
      .select('*')
      .gte('cost_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('cost_date', { ascending: false })
      .limit(limit);
    
    if (provider) {
      query = query.eq('provider', provider);
    }
    
    if (costType) {
      query = query.eq('cost_type', costType);
    }
    
    const { data: costs, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch costs' },
        { status: 500 }
      );
    }
    
    // Calculate total
    const total = costs?.reduce((sum, cost) => sum + cost.amount_cents, 0) || 0;
    
    // Group by provider
    const byProvider: Record<string, number> = {};
    costs?.forEach(cost => {
      byProvider[cost.provider] = (byProvider[cost.provider] || 0) + cost.amount_cents;
    });
    
    return NextResponse.json({
      success: true,
      count: costs?.length || 0,
      total_cents: total,
      by_provider: byProvider,
      costs,
    });
    
  } catch (error) {
    console.error('Error fetching costs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
