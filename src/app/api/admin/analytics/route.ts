import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/analytics/record
 * 
 * Manually trigger daily analytics recording
 * Should be called by a cron job daily at midnight UTC
 * 
 * Or use Supabase Edge Functions with pg_cron:
 * SELECT cron.schedule('record-daily-analytics', '0 0 * * *', $$
 *   SELECT public.record_daily_analytics();
 * $$);
 */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin access or API key
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.CRON_SECRET;
    
    // Check if request is from authorized source
    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
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
    
    // Call the database function to record analytics
    const { error } = await supabase.rpc('record_daily_analytics');
    
    if (error) {
      console.error('Error recording daily analytics:', error);
      return NextResponse.json(
        { error: 'Failed to record analytics', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Daily analytics recorded successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error in analytics recording endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/analytics?days=30
 * 
 * Get analytics metrics for specified period
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
    
    // Get dashboard metrics
    const { data: metrics, error } = await supabase
      .rpc('get_admin_dashboard_metrics', { p_days: days });
    
    if (error) {
      console.error('Error fetching analytics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }
    
    // Get daily metrics for chart data
    const { data: dailyMetrics } = await supabase
      .from('analytics_metrics')
      .select('*')
      .gte('metric_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('metric_date', { ascending: true });
    
    return NextResponse.json({
      success: true,
      period_days: days,
      summary: metrics?.[0] || {},
      daily_metrics: dailyMetrics || [],
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
