-- Generate Test Data for Admin System (SQL Version)
-- Run this in Supabase SQL Editor to populate test data

-- ============================================================================
-- WARNING: This will insert test data. Only run in development!
-- ============================================================================

DO $$
DECLARE
  v_test_user_id UUID;
  v_date DATE;
  v_revenue BIGINT;
  v_costs BIGINT;
  i INTEGER;
  j INTEGER;
BEGIN
  -- Get or create a test user
  SELECT id INTO v_test_user_id FROM auth.users LIMIT 1;
  
  IF v_test_user_id IS NULL THEN
    v_test_user_id := '00000000-0000-0000-0000-000000000000';
  END IF;
  
  RAISE NOTICE 'Using test user: %', v_test_user_id;
  
  -- Generate revenue transactions (last 30 days)
  RAISE NOTICE 'Generating revenue transactions...';
  
  FOR i IN 0..29 LOOP
    v_date := CURRENT_DATE - i;
    
    -- Generate 3-8 transactions per day
    FOR j IN 1..(3 + floor(random() * 6)::int) LOOP
      INSERT INTO public.revenue_transactions (
        user_id,
        transaction_type,
        amount_cents,
        currency,
        plan_type,
        billing_period,
        description,
        transaction_date
      ) VALUES (
        v_test_user_id,
        CASE WHEN random() > 0.95 THEN 'refund' ELSE 'subscription' END,
        CASE 
          WHEN random() < 0.33 THEN 2900  -- Starter
          WHEN random() < 0.66 THEN 9900  -- Professional
          ELSE 29900  -- Enterprise
        END * (CASE WHEN random() > 0.95 THEN -1 ELSE 1 END),
        'EUR',
        CASE 
          WHEN random() < 0.33 THEN 'starter'
          WHEN random() < 0.66 THEN 'professional'
          ELSE 'enterprise'
        END,
        CASE WHEN random() > 0.7 THEN 'annual' ELSE 'monthly' END,
        'Test transaction ' || j,
        v_date + (random() * interval '24 hours')
      );
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Generated revenue transactions ✓';
  
  -- Generate cost tracking (last 30 days)
  RAISE NOTICE 'Generating cost tracking...';
  
  FOR i IN 0..29 LOOP
    v_date := CURRENT_DATE - i;
    
    -- Vapi calls
    INSERT INTO public.cost_tracking (
      cost_type, provider, amount_cents, currency,
      quantity, unit, unit_price_cents,
      description, cost_date
    ) VALUES (
      'vapi_call', 'vapi',
      (100 + floor(random() * 500)::int) * 250,
      'EUR',
      100 + floor(random() * 500)::int,
      'minutes', 250,
      'Vapi AI calls',
      v_date + (random() * interval '24 hours')
    );
    
    -- Twilio calls
    INSERT INTO public.cost_tracking (
      cost_type, provider, amount_cents, currency,
      quantity, unit, unit_price_cents,
      description, cost_date
    ) VALUES (
      'twilio_call', 'twilio',
      (100 + floor(random() * 500)::int) * 150,
      'EUR',
      100 + floor(random() * 500)::int,
      'minutes', 150,
      'Twilio phone calls',
      v_date + (random() * interval '24 hours')
    );
    
    -- Twilio SMS
    INSERT INTO public.cost_tracking (
      cost_type, provider, amount_cents, currency,
      quantity, unit, unit_price_cents,
      description, cost_date
    ) VALUES (
      'twilio_sms', 'twilio',
      (50 + floor(random() * 200)::int) * 80,
      'EUR',
      50 + floor(random() * 200)::int,
      'sms', 80,
      'Twilio SMS',
      v_date + (random() * interval '24 hours')
    );
    
    -- Supabase
    INSERT INTO public.cost_tracking (
      cost_type, provider, amount_cents, currency,
      quantity, unit, unit_price_cents,
      description, cost_date
    ) VALUES (
      'supabase', 'supabase',
      (10 + floor(random() * 50)::int) * 25,
      'EUR',
      10 + floor(random() * 50)::int,
      'gb', 25,
      'Supabase database',
      v_date + (random() * interval '24 hours')
    );
  END LOOP;
  
  RAISE NOTICE 'Generated cost tracking ✓';
  
  -- Generate complaints
  RAISE NOTICE 'Generating complaints...';
  
  FOR i IN 1..15 LOOP
    INSERT INTO public.complaints (
      user_id,
      complaint_type,
      severity,
      title,
      description,
      detected_by_ai,
      ai_confidence_score,
      ai_transcript,
      status,
      reported_at
    ) VALUES (
      v_test_user_id,
      (ARRAY['service_quality', 'billing', 'technical', 'legal', 'other'])[floor(random() * 5 + 1)::int],
      (ARRAY['low', 'medium', 'high', 'critical'])[floor(random() * 4 + 1)::int],
      'Test complaint ' || i,
      'This is a test complaint for development purposes.',
      random() > 0.5,
      CASE WHEN random() > 0.5 THEN 0.6 + (random() * 0.4) ELSE NULL END,
      CASE WHEN random() > 0.5 THEN 'Sample transcript showing issue...' ELSE NULL END,
      CASE 
        WHEN i <= 5 THEN 'new'
        ELSE (ARRAY['in_progress', 'resolved', 'escalated'])[floor(random() * 3 + 1)::int]
      END,
      NOW() - (random() * interval '30 days')
    );
  END LOOP;
  
  RAISE NOTICE 'Generated complaints ✓';
  
  -- Generate analytics metrics (last 30 days)
  RAISE NOTICE 'Generating analytics metrics...';
  
  FOR i IN 0..29 LOOP
    v_date := CURRENT_DATE - i;
    
    -- Calculate day's revenue
    SELECT COALESCE(SUM(amount_cents), 0) INTO v_revenue
    FROM public.revenue_transactions
    WHERE transaction_date::DATE = v_date;
    
    -- Calculate day's costs
    SELECT COALESCE(SUM(amount_cents), 0) INTO v_costs
    FROM public.cost_tracking
    WHERE cost_date::DATE = v_date;
    
    INSERT INTO public.analytics_metrics (
      metric_date,
      total_users,
      new_users_today,
      active_users_today,
      revenue_today_cents,
      costs_today_cents,
      profit_today_cents,
      total_calls_today,
      total_minutes_today,
      free_tier_users,
      starter_users,
      professional_users,
      enterprise_users
    ) VALUES (
      v_date,
      100 + (i * 5),
      2 + floor(random() * 10)::int,
      20 + floor(random() * 30)::int,
      v_revenue,
      v_costs,
      v_revenue - v_costs,
      50 + floor(random() * 100)::int,
      200 + floor(random() * 500)::int,
      30,
      40,
      25,
      5
    );
  END LOOP;
  
  RAISE NOTICE 'Generated analytics metrics ✓';
  RAISE NOTICE 'Test data generation complete! ✨';
  
END $$;

-- Verify data was inserted
SELECT 'Revenue Transactions' as table_name, COUNT(*) as count FROM public.revenue_transactions
UNION ALL
SELECT 'Cost Tracking', COUNT(*) FROM public.cost_tracking
UNION ALL
SELECT 'Complaints', COUNT(*) FROM public.complaints
UNION ALL
SELECT 'Analytics Metrics', COUNT(*) FROM public.analytics_metrics;
