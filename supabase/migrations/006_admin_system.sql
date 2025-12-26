-- Migration: Admin System for Zencall
-- Purpose: Create admin role, analytics tracking, and complaints management
-- Created: 2025-12-26
-- Domain: zen-call.net

-- =============================================================================
-- ADMIN ROLES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer', -- 'super_admin', 'admin', 'viewer'
  permissions JSONB NOT NULL DEFAULT '{"view_analytics": true, "view_complaints": true, "manage_users": false, "manage_billing": false}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =============================================================================
-- ANALYTICS & METRICS TRACKING
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Date tracking (daily granularity)
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Client metrics
  total_users INTEGER NOT NULL DEFAULT 0,
  new_users_today INTEGER NOT NULL DEFAULT 0,
  active_users_today INTEGER NOT NULL DEFAULT 0,
  churned_users_today INTEGER NOT NULL DEFAULT 0,
  
  -- Financial metrics (in cents to avoid floating point issues)
  revenue_today_cents BIGINT NOT NULL DEFAULT 0, -- CA (Chiffre d'Affaires)
  costs_today_cents BIGINT NOT NULL DEFAULT 0,
  profit_today_cents BIGINT NOT NULL DEFAULT 0,
  
  -- Currency
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  
  -- Service usage metrics
  total_calls_today INTEGER NOT NULL DEFAULT 0,
  total_minutes_today INTEGER NOT NULL DEFAULT 0,
  total_sms_today INTEGER NOT NULL DEFAULT 0,
  
  -- AI costs breakdown (in cents)
  vapi_costs_cents BIGINT NOT NULL DEFAULT 0,
  twilio_costs_cents BIGINT NOT NULL DEFAULT 0,
  other_costs_cents BIGINT NOT NULL DEFAULT 0,
  
  -- Subscription metrics
  free_tier_users INTEGER NOT NULL DEFAULT 0,
  starter_users INTEGER NOT NULL DEFAULT 0,
  professional_users INTEGER NOT NULL DEFAULT 0,
  enterprise_users INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(metric_date)
);

-- =============================================================================
-- COMPLAINTS MANAGEMENT (AI Agent Escalation)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Complaint source
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  call_id UUID, -- Reference to the call that generated the complaint
  
  -- Complaint details
  complaint_type VARCHAR(50) NOT NULL, -- 'service_quality', 'billing', 'technical', 'legal', 'other'
  severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- AI Agent metadata
  detected_by_ai BOOLEAN NOT NULL DEFAULT false,
  ai_confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  ai_suggested_category VARCHAR(50),
  ai_transcript TEXT, -- Full conversation transcript if from call
  
  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'new', -- 'new', 'in_progress', 'resolved', 'closed', 'escalated'
  assigned_to UUID REFERENCES public.admin_users(id),
  resolution_notes TEXT,
  
  -- Contact info (if user not logged in)
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  
  -- Timestamps
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- REVENUE TRANSACTIONS (Detailed tracking)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.revenue_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Transaction details
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(30) NOT NULL, -- 'subscription', 'overage', 'refund', 'credit'
  
  -- Financial data (in cents)
  amount_cents BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  
  -- Stripe integration
  stripe_payment_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  
  -- Subscription info
  plan_type VARCHAR(20), -- 'free', 'starter', 'professional', 'enterprise'
  billing_period VARCHAR(20), -- 'monthly', 'annual'
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- COST TRACKING (AI usage, infrastructure)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.cost_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Cost details
  cost_type VARCHAR(30) NOT NULL, -- 'vapi_call', 'twilio_sms', 'twilio_call', 'supabase', 'hosting', 'other'
  provider VARCHAR(50) NOT NULL, -- 'vapi', 'twilio', 'supabase', 'vercel', etc.
  
  -- Financial data (in cents)
  amount_cents BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  
  -- Associated resources
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  call_id UUID,
  resource_id VARCHAR(255), -- External provider's resource ID
  
  -- Usage metrics
  quantity DECIMAL(10, 2), -- e.g., minutes, SMS count, API calls
  unit VARCHAR(20), -- 'minutes', 'sms', 'calls', 'gb', etc.
  unit_price_cents BIGINT, -- Price per unit
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  cost_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Admin users
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- Analytics metrics
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_date ON public.analytics_metrics(metric_date DESC);

-- Complaints
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_severity ON public.complaints(severity);
CREATE INDEX IF NOT EXISTS idx_complaints_ai_detected ON public.complaints(detected_by_ai) WHERE detected_by_ai = true;
CREATE INDEX IF NOT EXISTS idx_complaints_assigned ON public.complaints(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_complaints_reported_at ON public.complaints(reported_at DESC);

-- Revenue transactions
CREATE INDEX IF NOT EXISTS idx_revenue_user_id ON public.revenue_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON public.revenue_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_type ON public.revenue_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_revenue_stripe_payment ON public.revenue_transactions(stripe_payment_id);

-- Cost tracking
CREATE INDEX IF NOT EXISTS idx_costs_user_id ON public.cost_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_costs_date ON public.cost_tracking(cost_date DESC);
CREATE INDEX IF NOT EXISTS idx_costs_type ON public.cost_tracking(cost_type);
CREATE INDEX IF NOT EXISTS idx_costs_provider ON public.cost_tracking(provider);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Admin users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only super admins can manage admin users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Analytics metrics
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
  ON public.analytics_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage analytics"
  ON public.analytics_metrics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Complaints
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create complaints"
  ON public.complaints FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage complaints"
  ON public.complaints FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Revenue transactions
ALTER TABLE public.revenue_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.revenue_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON public.revenue_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage transactions"
  ON public.revenue_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Cost tracking
ALTER TABLE public.cost_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all costs"
  ON public.cost_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage costs"
  ON public.cost_tracking FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get admin dashboard metrics
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_metrics(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_users BIGINT,
  new_users_period BIGINT,
  active_users_today BIGINT,
  total_revenue_cents BIGINT,
  total_costs_cents BIGINT,
  profit_cents BIGINT,
  profit_margin DECIMAL(5,2),
  total_calls BIGINT,
  total_minutes BIGINT,
  avg_call_duration DECIMAL(10,2),
  open_complaints BIGINT,
  critical_complaints BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- User metrics
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '1 year')::BIGINT AS total_users,
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL)::BIGINT AS new_users_period,
    (SELECT COALESCE(SUM(active_users_today), 0) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::BIGINT AS active_users_today,
    
    -- Financial metrics
    (SELECT COALESCE(SUM(revenue_today_cents), 0) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::BIGINT AS total_revenue_cents,
    (SELECT COALESCE(SUM(costs_today_cents), 0) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::BIGINT AS total_costs_cents,
    (SELECT COALESCE(SUM(profit_today_cents), 0) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::BIGINT AS profit_cents,
    (
      CASE 
        WHEN (SELECT SUM(revenue_today_cents) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days) > 0
        THEN (
          (SELECT SUM(profit_today_cents) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::DECIMAL / 
          (SELECT SUM(revenue_today_cents) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::DECIMAL * 100
        )
        ELSE 0
      END
    )::DECIMAL(5,2) AS profit_margin,
    
    -- Usage metrics
    (SELECT COALESCE(SUM(total_calls_today), 0) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::BIGINT AS total_calls,
    (SELECT COALESCE(SUM(total_minutes_today), 0) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::BIGINT AS total_minutes,
    (
      CASE 
        WHEN (SELECT SUM(total_calls_today) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days) > 0
        THEN (
          (SELECT SUM(total_minutes_today) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::DECIMAL / 
          (SELECT SUM(total_calls_today) FROM public.analytics_metrics WHERE metric_date >= CURRENT_DATE - p_days)::DECIMAL
        )
        ELSE 0
      END
    )::DECIMAL(10,2) AS avg_call_duration,
    
    -- Complaints
    (SELECT COUNT(*) FROM public.complaints WHERE status IN ('new', 'in_progress'))::BIGINT AS open_complaints,
    (SELECT COUNT(*) FROM public.complaints WHERE status IN ('new', 'in_progress') AND severity = 'critical')::BIGINT AS critical_complaints;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Record daily analytics snapshot
CREATE OR REPLACE FUNCTION public.record_daily_analytics()
RETURNS void AS $$
DECLARE
  v_total_users INTEGER;
  v_new_users INTEGER;
  v_revenue BIGINT;
  v_costs BIGINT;
BEGIN
  -- Calculate metrics for today
  SELECT COUNT(*) INTO v_total_users FROM auth.users;
  SELECT COUNT(*) INTO v_new_users FROM auth.users WHERE created_at::DATE = CURRENT_DATE;
  SELECT COALESCE(SUM(amount_cents), 0) INTO v_revenue FROM public.revenue_transactions WHERE transaction_date::DATE = CURRENT_DATE;
  SELECT COALESCE(SUM(amount_cents), 0) INTO v_costs FROM public.cost_tracking WHERE cost_date::DATE = CURRENT_DATE;
  
  -- Insert or update today's metrics
  INSERT INTO public.analytics_metrics (
    metric_date,
    total_users,
    new_users_today,
    revenue_today_cents,
    costs_today_cents,
    profit_today_cents
  ) VALUES (
    CURRENT_DATE,
    v_total_users,
    v_new_users,
    v_revenue,
    v_costs,
    v_revenue - v_costs
  )
  ON CONFLICT (metric_date) DO UPDATE SET
    total_users = v_total_users,
    new_users_today = v_new_users,
    revenue_today_cents = v_revenue,
    costs_today_cents = v_costs,
    profit_today_cents = v_revenue - v_costs,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create complaint from AI agent
CREATE OR REPLACE FUNCTION public.create_ai_complaint(
  p_user_id UUID,
  p_call_id UUID,
  p_title VARCHAR(255),
  p_description TEXT,
  p_transcript TEXT,
  p_complaint_type VARCHAR(50),
  p_severity VARCHAR(20),
  p_confidence_score DECIMAL(3,2)
)
RETURNS UUID AS $$
DECLARE
  v_complaint_id UUID;
BEGIN
  INSERT INTO public.complaints (
    user_id,
    call_id,
    complaint_type,
    severity,
    title,
    description,
    detected_by_ai,
    ai_confidence_score,
    ai_transcript,
    status
  ) VALUES (
    p_user_id,
    p_call_id,
    p_complaint_type,
    p_severity,
    p_title,
    p_description,
    true,
    p_confidence_score,
    p_transcript,
    CASE WHEN p_severity IN ('high', 'critical') THEN 'escalated' ELSE 'new' END
  )
  RETURNING id INTO v_complaint_id;
  
  RETURN v_complaint_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at for admin_users
CREATE OR REPLACE FUNCTION public.update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_users_updated_at();

-- Auto-update updated_at for complaints
CREATE OR REPLACE FUNCTION public.update_complaints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_complaints_updated_at ON public.complaints;
CREATE TRIGGER trigger_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_complaints_updated_at();

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Create super admin account (will be linked to your user after registration)
-- You'll need to update this with your actual user_id after creating your account
-- Example: INSERT INTO public.admin_users (user_id, role, permissions, created_by)
--          VALUES ('your-user-uuid-here', 'super_admin', 
--                  '{"view_analytics": true, "view_complaints": true, "manage_users": true, "manage_billing": true}'::jsonb,
--                  'your-user-uuid-here');

-- =============================================================================
-- GRANTS
-- =============================================================================

GRANT SELECT, INSERT, UPDATE ON public.admin_users TO authenticated;
GRANT SELECT ON public.analytics_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.complaints TO authenticated;
GRANT SELECT ON public.revenue_transactions TO authenticated;
GRANT SELECT ON public.cost_tracking TO authenticated;

GRANT ALL ON public.admin_users TO service_role;
GRANT ALL ON public.analytics_metrics TO service_role;
GRANT ALL ON public.complaints TO service_role;
GRANT ALL ON public.revenue_transactions TO service_role;
GRANT ALL ON public.cost_tracking TO service_role;

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_metrics(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_daily_analytics() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_ai_complaint(UUID, UUID, VARCHAR, TEXT, TEXT, VARCHAR, VARCHAR, DECIMAL) TO service_role;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.admin_users IS 'Admin users with role-based access control';
COMMENT ON TABLE public.analytics_metrics IS 'Daily aggregated metrics for admin dashboard (clients, CA, costs)';
COMMENT ON TABLE public.complaints IS 'User complaints with AI agent detection and escalation';
COMMENT ON TABLE public.revenue_transactions IS 'Detailed revenue tracking for CA analysis';
COMMENT ON TABLE public.cost_tracking IS 'Infrastructure and AI usage costs tracking';

COMMENT ON FUNCTION public.is_admin(UUID) IS 'Check if a user has admin privileges';
COMMENT ON FUNCTION public.get_admin_dashboard_metrics(INTEGER) IS 'Get comprehensive dashboard metrics for specified period';
COMMENT ON FUNCTION public.record_daily_analytics() IS 'Daily cron job to snapshot analytics (call via pg_cron or external scheduler)';
COMMENT ON FUNCTION public.create_ai_complaint(UUID, UUID, VARCHAR, TEXT, TEXT, VARCHAR, VARCHAR, DECIMAL) IS 'Create complaint detected by AI agent from call transcript';
