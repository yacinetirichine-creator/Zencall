import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Webhook pour analytics des vues de pricing
 * POST /api/analytics/pricing-view
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const { country, plan_viewed, session_id, organization_id } = body || {};

    if (!country || !plan_viewed) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    
    // Stocker l'événement analytics
    await supabase.from('analytics_events').insert({
      event_type: 'pricing_view',
      country,
      plan_viewed,
      session_id,
      organization_id,
      metadata: {
        user_agent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
