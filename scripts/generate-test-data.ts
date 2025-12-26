/**
 * Test Data Generation Script for Admin System
 * 
 * This script generates sample data for testing the admin dashboard:
 * - Sample revenue transactions
 * - Sample cost tracking
 * - Sample complaints (including AI-detected)
 * - Daily analytics metrics
 * 
 * Usage:
 * 1. Set your admin API keys in .env.local
 * 2. Run: npx tsx scripts/generate-test-data.ts
 * 
 * Or use Supabase SQL Editor to run the SQL directly
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateTestData() {
  console.log('🚀 Generating test data for admin system...\n');
  
  // Get a test user (or use first available user)
  const { data: users } = await supabase
    .from('auth.users')
    .select('id')
    .limit(1);
  
  const testUserId = users?.[0]?.id || '00000000-0000-0000-0000-000000000000';
  
  // 1. Generate revenue transactions (last 30 days)
  console.log('💰 Generating revenue transactions...');
  
  const revenueData = [];
  const planTypes = ['starter', 'professional', 'enterprise'];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate 3-8 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 6) + 3;
    
    for (let j = 0; j < transactionsPerDay; j++) {
      const planType = planTypes[Math.floor(Math.random() * planTypes.length)];
      const amount = planType === 'starter' ? 2900 : planType === 'professional' ? 9900 : 29900;
      
      revenueData.push({
        user_id: testUserId,
        transaction_type: Math.random() > 0.95 ? 'refund' : 'subscription',
        amount_cents: Math.random() > 0.95 ? -amount : amount,
        currency: 'EUR',
        plan_type: planType,
        billing_period: Math.random() > 0.7 ? 'annual' : 'monthly',
        description: `${planType} plan - ${date.toISOString().split('T')[0]}`,
        transaction_date: date.toISOString(),
      });
    }
  }
  
  const { error: revenueError } = await supabase
    .from('revenue_transactions')
    .insert(revenueData);
  
  if (revenueError) {
    console.error('❌ Error inserting revenue:', revenueError);
  } else {
    console.log(`✅ Generated ${revenueData.length} revenue transactions\n`);
  }
  
  // 2. Generate cost tracking (last 30 days)
  console.log('💸 Generating cost tracking...');
  
  const costData = [];
  const providers = [
    { name: 'vapi', type: 'vapi_call', unit: 'minutes', unitPrice: 250 },
    { name: 'twilio', type: 'twilio_call', unit: 'minutes', unitPrice: 150 },
    { name: 'twilio', type: 'twilio_sms', unit: 'sms', unitPrice: 80 },
    { name: 'supabase', type: 'supabase', unit: 'gb', unitPrice: 25 },
  ];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate costs for each provider
    providers.forEach(provider => {
      const quantity = provider.unit === 'minutes' 
        ? Math.floor(Math.random() * 500) + 100
        : provider.unit === 'sms'
        ? Math.floor(Math.random() * 200) + 50
        : Math.floor(Math.random() * 50) + 10;
      
      costData.push({
        cost_type: provider.type,
        provider: provider.name,
        amount_cents: quantity * provider.unitPrice,
        currency: 'EUR',
        quantity: quantity,
        unit: provider.unit,
        unit_price_cents: provider.unitPrice,
        description: `${provider.name} usage - ${date.toISOString().split('T')[0]}`,
        cost_date: date.toISOString(),
      });
    });
  }
  
  const { error: costError } = await supabase
    .from('cost_tracking')
    .insert(costData);
  
  if (costError) {
    console.error('❌ Error inserting costs:', costError);
  } else {
    console.log(`✅ Generated ${costData.length} cost records\n`);
  }
  
  // 3. Generate complaints
  console.log('🚨 Generating complaints...');
  
  const complaintTypes = ['service_quality', 'billing', 'technical', 'legal', 'other'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['new', 'in_progress', 'resolved', 'escalated'];
  
  const complaintsData = [];
  
  // Generate 15 complaints
  for (let i = 0; i < 15; i++) {
    const detectedByAi = Math.random() > 0.5;
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const complaintType = complaintTypes[Math.floor(Math.random() * complaintTypes.length)];
    const status = i < 5 ? 'new' : statuses[Math.floor(Math.random() * statuses.length)];
    
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    complaintsData.push({
      user_id: testUserId,
      complaint_type: complaintType,
      severity: severity,
      title: `${complaintType.replace('_', ' ')} issue - ${detectedByAi ? 'AI detected' : 'User reported'}`,
      description: `This is a test ${severity} severity complaint about ${complaintType}.`,
      detected_by_ai: detectedByAi,
      ai_confidence_score: detectedByAi ? (Math.random() * 0.4 + 0.6) : null,
      ai_transcript: detectedByAi ? 'Sample transcript showing customer frustration...' : null,
      status: status,
      reported_at: date.toISOString(),
    });
  }
  
  const { error: complaintsError } = await supabase
    .from('complaints')
    .insert(complaintsData);
  
  if (complaintsError) {
    console.error('❌ Error inserting complaints:', complaintsError);
  } else {
    console.log(`✅ Generated ${complaintsData.length} complaints\n`);
  }
  
  // 4. Generate daily analytics metrics
  console.log('📊 Generating analytics metrics...');
  
  const analyticsData = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Calculate totals for this day
    const dayRevenue = revenueData
      .filter(r => new Date(r.transaction_date).toDateString() === date.toDateString())
      .reduce((sum, r) => sum + r.amount_cents, 0);
    
    const dayCosts = costData
      .filter(c => new Date(c.cost_date).toDateString() === date.toDateString())
      .reduce((sum, c) => sum + c.amount_cents, 0);
    
    analyticsData.push({
      metric_date: date.toISOString().split('T')[0],
      total_users: 100 + i * 5,
      new_users_today: Math.floor(Math.random() * 10) + 2,
      active_users_today: Math.floor(Math.random() * 30) + 20,
      revenue_today_cents: dayRevenue,
      costs_today_cents: dayCosts,
      profit_today_cents: dayRevenue - dayCosts,
      total_calls_today: Math.floor(Math.random() * 100) + 50,
      total_minutes_today: Math.floor(Math.random() * 500) + 200,
      free_tier_users: 30,
      starter_users: 40,
      professional_users: 25,
      enterprise_users: 5,
    });
  }
  
  const { error: analyticsError } = await supabase
    .from('analytics_metrics')
    .insert(analyticsData);
  
  if (analyticsError) {
    console.error('❌ Error inserting analytics:', analyticsError);
  } else {
    console.log(`✅ Generated ${analyticsData.length} analytics records\n`);
  }
  
  console.log('✨ Test data generation complete!\n');
  console.log('You can now visit /admin to see the dashboard with data.');
}

// Run the script
generateTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
