-- =============================================
-- ZENCALL - Schéma de base de données initial
-- =============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Types énumérés
CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin', 'user');
CREATE TYPE assistant_type AS ENUM ('astreinte', 'rdv', 'info', 'outbound');
CREATE TYPE language AS ENUM ('fr', 'es', 'en', 'nl', 'ar');
CREATE TYPE call_status AS ENUM ('completed', 'missed', 'transferred', 'failed', 'in_progress');
CREATE TYPE call_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE sentiment AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'running', 'paused', 'completed');
CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro', 'business', 'agency', 'enterprise');

-- Table: organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  plan plan_type DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: profiles (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  phone VARCHAR(50),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: assistants
CREATE TABLE assistants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type assistant_type NOT NULL DEFAULT 'info',
  language language NOT NULL DEFAULT 'fr',
  voice_id VARCHAR(100),
  system_prompt TEXT,
  first_message TEXT,
  vapi_assistant_id VARCHAR(100),
  phone_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  phone VARCHAR(50) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  company VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, phone)
);

-- Table: call_logs
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assistant_id UUID REFERENCES assistants(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  vapi_call_id VARCHAR(100),
  direction call_direction NOT NULL DEFAULT 'inbound',
  caller_number VARCHAR(50),
  recipient_number VARCHAR(50),
  status call_status NOT NULL DEFAULT 'in_progress',
  duration_seconds INTEGER DEFAULT 0,
  transcript TEXT,
  summary TEXT,
  sentiment sentiment,
  recording_url TEXT,
  cost DECIMAL(10, 4),
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assistant_id UUID REFERENCES assistants(id) ON DELETE SET NULL,
  call_log_id UUID REFERENCES call_logs(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  external_calendar_id VARCHAR(255),
  reminder_sent BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assistant_id UUID NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'custom',
  status campaign_status DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{"total_contacts": 0, "calls_made": 0, "calls_answered": 0, "calls_failed": 0, "success_rate": 0, "avg_duration": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: api_keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  permissions TEXT[] DEFAULT '{"read", "write"}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_assistants_org ON assistants(organization_id);
CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_call_logs_org ON call_logs(organization_id);
CREATE INDEX idx_call_logs_created ON call_logs(created_at DESC);
CREATE INDEX idx_appointments_org ON appointments(organization_id);
CREATE INDEX idx_appointments_start ON appointments(start_time);
CREATE INDEX idx_campaigns_org ON campaigns(organization_id);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their organization
CREATE POLICY "Users can view own organization" ON organizations FOR SELECT USING (
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- Policy: Users can read/write in their organization
CREATE POLICY "Users can manage assistants" ON assistants FOR ALL USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage contacts" ON contacts FOR ALL USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can view calls" ON call_logs FOR SELECT USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage appointments" ON appointments FOR ALL USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage campaigns" ON campaigns FOR ALL USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can manage API keys" ON api_keys FOR ALL USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin'))
);

CREATE POLICY "Admins can manage webhooks" ON webhooks FOR ALL USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin'))
);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_assistants_updated BEFORE UPDATE ON assistants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_contacts_updated BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_appointments_updated BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_webhooks_updated BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Créer profil après inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  org_name TEXT;
BEGIN
  -- Créer organisation si nom fourni
  org_name := NEW.raw_user_meta_data->>'organization_name';
  IF org_name IS NOT NULL AND org_name != '' THEN
    INSERT INTO organizations (name, slug)
    VALUES (org_name, LOWER(REPLACE(org_name, ' ', '-')) || '-' || SUBSTRING(NEW.id::TEXT, 1, 8))
    RETURNING id INTO org_id;
  END IF;
  
  -- Créer profil
  INSERT INTO profiles (id, email, full_name, organization_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    org_id,
    CASE WHEN org_id IS NOT NULL THEN 'org_admin' ELSE 'user' END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
