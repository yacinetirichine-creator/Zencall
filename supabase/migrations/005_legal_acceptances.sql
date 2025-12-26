-- Migration: Legal Acceptances Tracking Table
-- Purpose: Store legal consent audit trail for GDPR compliance
-- Created: 2025-12-26
-- Author: JARVIS Legal Infrastructure

-- =============================================================================
-- LEGAL ACCEPTANCES TABLE
-- =============================================================================
-- This table stores a complete audit trail of all legal document acceptances
-- Required for GDPR Article 7 (proof of consent) compliance
-- Allows tracking consent versions, withdrawal, and modification over time

CREATE TABLE IF NOT EXISTS public.legal_acceptances (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Document versions accepted
  cgu_version VARCHAR(10) NOT NULL DEFAULT '1.0',
  cgv_version VARCHAR(10) NOT NULL DEFAULT '1.0',
  privacy_version VARCHAR(10) NOT NULL DEFAULT '1.0',
  
  -- Consent flags
  cgu_accepted BOOLEAN NOT NULL DEFAULT false,
  cgv_accepted BOOLEAN NOT NULL DEFAULT false,
  privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  
  -- Audit trail data (GDPR requirement)
  ip_address INET NOT NULL,
  user_agent TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Consent withdrawal tracking
  withdrawn_at TIMESTAMPTZ,
  withdrawal_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Fast lookup by user_id (most common query)
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user_id 
  ON public.legal_acceptances(user_id);

-- Filter by acceptance date (for reporting)
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_accepted_at 
  ON public.legal_acceptances(accepted_at DESC);

-- Find active consents (not withdrawn)
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_withdrawn 
  ON public.legal_acceptances(user_id, withdrawn_at) 
  WHERE withdrawn_at IS NULL;

-- Marketing consent filtering (for email campaigns)
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_marketing 
  ON public.legal_acceptances(user_id, marketing_consent) 
  WHERE marketing_consent = true AND withdrawn_at IS NULL;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on the table
ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own legal acceptances
CREATE POLICY "Users can view their own legal acceptances"
  ON public.legal_acceptances
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own legal acceptances (at registration)
CREATE POLICY "Users can insert their own legal acceptances"
  ON public.legal_acceptances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own legal acceptances (withdraw consent)
CREATE POLICY "Users can update their own legal acceptances"
  ON public.legal_acceptances
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Service role can manage all acceptances (for admin operations)
CREATE POLICY "Service role can manage all legal acceptances"
  ON public.legal_acceptances
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_legal_acceptances_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to table
DROP TRIGGER IF EXISTS trigger_legal_acceptances_updated_at ON public.legal_acceptances;
CREATE TRIGGER trigger_legal_acceptances_updated_at
  BEFORE UPDATE ON public.legal_acceptances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_legal_acceptances_updated_at();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function: Get latest active legal acceptance for a user
CREATE OR REPLACE FUNCTION public.get_active_legal_acceptance(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  cgu_version VARCHAR(10),
  cgv_version VARCHAR(10),
  privacy_version VARCHAR(10),
  cgu_accepted BOOLEAN,
  cgv_accepted BOOLEAN,
  privacy_accepted BOOLEAN,
  marketing_consent BOOLEAN,
  accepted_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    la.id,
    la.cgu_version,
    la.cgv_version,
    la.privacy_version,
    la.cgu_accepted,
    la.cgv_accepted,
    la.privacy_accepted,
    la.marketing_consent,
    la.accepted_at
  FROM public.legal_acceptances la
  WHERE la.user_id = p_user_id
    AND la.withdrawn_at IS NULL
  ORDER BY la.accepted_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Withdraw consent for a user
CREATE OR REPLACE FUNCTION public.withdraw_legal_consent(
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_updated INTEGER;
BEGIN
  -- Update the latest active acceptance to mark as withdrawn
  UPDATE public.legal_acceptances
  SET 
    withdrawn_at = NOW(),
    withdrawal_reason = p_reason,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND withdrawn_at IS NULL
    AND id = (
      SELECT id FROM public.legal_acceptances
      WHERE user_id = p_user_id AND withdrawn_at IS NULL
      ORDER BY accepted_at DESC
      LIMIT 1
    );
  
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user needs to re-accept updated legal documents
CREATE OR REPLACE FUNCTION public.needs_legal_reacceptance(
  p_user_id UUID,
  p_current_cgu_version VARCHAR(10) DEFAULT '1.0',
  p_current_cgv_version VARCHAR(10) DEFAULT '1.0',
  p_current_privacy_version VARCHAR(10) DEFAULT '1.0'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_latest_acceptance RECORD;
BEGIN
  -- Get the user's latest active acceptance
  SELECT * INTO v_latest_acceptance
  FROM public.get_active_legal_acceptance(p_user_id);
  
  -- If no acceptance found, user needs to accept
  IF v_latest_acceptance IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if any version has changed
  IF v_latest_acceptance.cgu_version != p_current_cgu_version
     OR v_latest_acceptance.cgv_version != p_current_cgv_version
     OR v_latest_acceptance.privacy_version != p_current_privacy_version
  THEN
    RETURN TRUE;
  END IF;
  
  -- All versions match, no re-acceptance needed
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.legal_acceptances IS 
  'Stores audit trail of legal document acceptances for GDPR compliance (Article 7).';

COMMENT ON COLUMN public.legal_acceptances.user_id IS 
  'User who accepted the legal documents (references auth.users).';

COMMENT ON COLUMN public.legal_acceptances.cgu_version IS 
  'Version of CGU (Terms of Use) that was accepted.';

COMMENT ON COLUMN public.legal_acceptances.cgv_version IS 
  'Version of CGV (Terms of Sale) that was accepted.';

COMMENT ON COLUMN public.legal_acceptances.privacy_version IS 
  'Version of Privacy Policy that was accepted.';

COMMENT ON COLUMN public.legal_acceptances.ip_address IS 
  'IP address from which consent was given (GDPR audit requirement).';

COMMENT ON COLUMN public.legal_acceptances.user_agent IS 
  'Browser User-Agent string when consent was given (GDPR audit requirement).';

COMMENT ON COLUMN public.legal_acceptances.accepted_at IS 
  'Timestamp when legal documents were accepted.';

COMMENT ON COLUMN public.legal_acceptances.withdrawn_at IS 
  'Timestamp when consent was withdrawn (NULL if still active).';

COMMENT ON COLUMN public.legal_acceptances.marketing_consent IS 
  'Whether user consented to marketing communications (optional, can be withdrawn separately).';

COMMENT ON FUNCTION public.get_active_legal_acceptance(UUID) IS 
  'Returns the latest active (non-withdrawn) legal acceptance for a user.';

COMMENT ON FUNCTION public.withdraw_legal_consent(UUID, TEXT) IS 
  'Withdraws the user''s legal consent and optionally records a reason.';

COMMENT ON FUNCTION public.needs_legal_reacceptance(UUID, VARCHAR, VARCHAR, VARCHAR) IS 
  'Checks if a user needs to re-accept legal documents due to version changes.';

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant appropriate permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.legal_acceptances TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_legal_acceptance(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.withdraw_legal_consent(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.needs_legal_reacceptance(UUID, VARCHAR, VARCHAR, VARCHAR) TO authenticated;

-- Grant full access to service role
GRANT ALL ON public.legal_acceptances TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- =============================================================================
-- EXAMPLE QUERIES
-- =============================================================================

-- Get current legal acceptance status for a user:
-- SELECT * FROM public.get_active_legal_acceptance('user-uuid-here');

-- Check if user needs to re-accept due to version change:
-- SELECT public.needs_legal_reacceptance('user-uuid-here', '1.1', '1.0', '1.0');

-- Withdraw consent:
-- SELECT public.withdraw_legal_consent('user-uuid-here', 'User requested account deletion');

-- Get all users with active marketing consent:
-- SELECT DISTINCT user_id FROM public.legal_acceptances 
-- WHERE marketing_consent = true AND withdrawn_at IS NULL;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
