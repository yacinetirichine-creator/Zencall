import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * API endpoint for AI agents to submit complaints
 * POST /api/admin/complaints/ai
 * 
 * This endpoint receives complaints detected by AI agents (e.g., Vapi.ai)
 * during customer calls and automatically creates complaint records.
 * 
 * @example
 * POST /api/admin/complaints/ai
 * {
 *   "user_id": "uuid-here",
 *   "call_id": "uuid-here",
 *   "title": "Customer expressed frustration with billing",
 *   "description": "Customer mentioned unexpected charges during conversation",
 *   "transcript": "Full call transcript here...",
 *   "complaint_type": "billing",
 *   "severity": "medium",
 *   "confidence_score": 0.85
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Parse request body
    const body = await request.json();
    
    const {
      user_id,
      call_id,
      title,
      description,
      transcript,
      complaint_type = 'other',
      severity = 'medium',
      confidence_score = 0.0,
      api_key, // Optional API key for authentication
    } = body;
    
    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title and description' },
        { status: 400 }
      );
    }
    
    // Validate API key (you should set this in environment variables)
    const expectedApiKey = process.env.AI_COMPLAINT_API_KEY;
    if (expectedApiKey && api_key !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    // Validate severity
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid severity. Must be: low, medium, high, or critical' },
        { status: 400 }
      );
    }
    
    // Validate complaint type
    const validTypes = ['service_quality', 'billing', 'technical', 'legal', 'other'];
    if (!validTypes.includes(complaint_type)) {
      return NextResponse.json(
        { error: 'Invalid complaint_type. Must be: service_quality, billing, technical, legal, or other' },
        { status: 400 }
      );
    }
    
    // Validate confidence score
    if (confidence_score < 0 || confidence_score > 1) {
      return NextResponse.json(
        { error: 'confidence_score must be between 0 and 1' },
        { status: 400 }
      );
    }
    
    // Use the database function to create complaint
    const { data, error } = await supabase
      .rpc('create_ai_complaint', {
        p_user_id: user_id || null,
        p_call_id: call_id || null,
        p_title: title,
        p_description: description,
        p_transcript: transcript || null,
        p_complaint_type: complaint_type,
        p_severity: severity,
        p_confidence_score: confidence_score,
      });
    
    if (error) {
      console.error('Error creating AI complaint:', error);
      return NextResponse.json(
        { error: 'Failed to create complaint', details: error.message },
        { status: 500 }
      );
    }
    
    // Get the created complaint
    const { data: complaint } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', data)
      .single();
    
    return NextResponse.json(
      {
        success: true,
        complaint_id: data,
        complaint,
        message: 'Complaint created successfully',
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error in AI complaint endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve AI-detected complaints
 * GET /api/admin/complaints/ai?limit=10&severity=critical
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    
    // Build query
    let query = supabase
      .from('complaints')
      .select('*')
      .eq('detected_by_ai', true)
      .order('reported_at', { ascending: false })
      .limit(limit);
    
    if (severity) {
      query = query.eq('severity', severity);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: complaints, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch complaints' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      count: complaints?.length || 0,
      complaints,
    });
    
  } catch (error) {
    console.error('Error fetching AI complaints:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
