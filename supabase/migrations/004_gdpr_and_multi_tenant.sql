-- =============================================
-- MIGRATION: Ajout champs RGPD et Twilio multi-tenant
-- =============================================

-- Ajouter champs Twilio à la table organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_account_sid VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_auth_token_encrypted TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_phone_number VARCHAR(50);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_configured BOOLEAN DEFAULT false;

-- Ajouter type d'organisation (B2B vs B2C)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS organization_type VARCHAR(10) DEFAULT 'b2b' CHECK (organization_type IN ('b2b', 'b2c'));
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS company_registration VARCHAR(100); -- SIRET/SIREN
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS vat_number VARCHAR(50);

-- Ajouter champs RGPD aux profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gdpr_consent_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS data_retention_policy VARCHAR(50) DEFAULT 'standard';

-- Créer table pour consentements RGPD détaillés
CREATE TABLE IF NOT EXISTS gdpr_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type VARCHAR(50) NOT NULL, -- 'terms', 'privacy', 'marketing', 'cookies'
  consent_given BOOLEAN NOT NULL,
  consent_version VARCHAR(20) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_gdpr_consents_user ON gdpr_consents(user_id);
CREATE INDEX idx_gdpr_consents_type ON gdpr_consents(consent_type);

-- Créer table pour demandes RGPD (accès, suppression, export)
CREATE TABLE IF NOT EXISTS gdpr_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  request_type VARCHAR(50) NOT NULL, -- 'data_access', 'data_export', 'data_deletion', 'data_portability'
  status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'processing', 'completed', 'rejected'
  reason TEXT,
  data_url TEXT, -- URL du fichier exporté
  processed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ -- Pour les liens de téléchargement
);

CREATE INDEX idx_gdpr_requests_user ON gdpr_requests(user_id);
CREATE INDEX idx_gdpr_requests_org ON gdpr_requests(organization_id);
CREATE INDEX idx_gdpr_requests_status ON gdpr_requests(status);

-- Créer table pour logs d'audit RGPD
CREATE TABLE IF NOT EXISTS gdpr_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_gdpr_audit_logs_user ON gdpr_audit_logs(user_id);
CREATE INDEX idx_gdpr_audit_logs_org ON gdpr_audit_logs(organization_id);
CREATE INDEX idx_gdpr_audit_logs_created ON gdpr_audit_logs(created_at);

-- Ajouter champ pour tracking consentement cookies
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cookie_consent JSONB DEFAULT '{"necessary": true, "analytics": false, "marketing": false}'::jsonb;

-- Créer fonction pour auto-suppression après 3 ans d'inactivité (RGPD)
CREATE OR REPLACE FUNCTION auto_delete_inactive_users()
RETURNS void AS $$
BEGIN
  -- Marquer pour suppression les utilisateurs inactifs depuis 3 ans
  UPDATE profiles
  SET deleted_at = NOW()
  WHERE last_seen_at < NOW() - INTERVAL '3 years'
    AND deleted_at IS NULL
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Créer table pour stocker les versions des documents légaux
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type VARCHAR(50) NOT NULL, -- 'terms', 'privacy', 'cookies', 'gdpr'
  version VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  effective_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(document_type, version)
);

CREATE INDEX idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX idx_legal_documents_effective ON legal_documents(effective_date);

-- Commentaires pour documentation
COMMENT ON COLUMN organizations.twilio_auth_token_encrypted IS 'Token Twilio chiffré - utiliser encrypt() pour stocker';
COMMENT ON COLUMN profiles.gdpr_consent_at IS 'Date du consentement RGPD initial';
COMMENT ON COLUMN profiles.data_retention_policy IS 'Politique de rétention: standard (3 ans), extended (7 ans), minimal (1 an)';
COMMENT ON TABLE gdpr_consents IS 'Historique complet des consentements utilisateurs pour conformité RGPD';
COMMENT ON TABLE gdpr_requests IS 'Demandes RGPD: accès, export, suppression des données';
