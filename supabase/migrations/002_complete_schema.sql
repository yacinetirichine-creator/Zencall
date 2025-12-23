-- =============================================
-- ZENCALL - Schéma de base de données complet
-- =============================================
-- Version: 2.0
-- Date: 2024-12-23
-- Description: Schéma complet avec toutes les tables et relations

-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Pour recherche full-text

-- =============================================
-- TYPES ÉNUMÉRÉS
-- =============================================

CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin', 'user');
CREATE TYPE assistant_type AS ENUM ('astreinte', 'rdv', 'info', 'outbound');
CREATE TYPE language AS ENUM ('fr', 'es', 'en', 'nl', 'ar');
CREATE TYPE call_status AS ENUM ('completed', 'missed', 'transferred', 'failed', 'in_progress');
CREATE TYPE call_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE sentiment AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'running', 'paused', 'completed');
CREATE TYPE campaign_type AS ENUM ('reminder', 'payment', 'survey', 'custom');
CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro', 'business', 'agency', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing', 'incomplete');
CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');
CREATE TYPE integration_type AS ENUM ('calendar', 'crm', 'payment', 'webhook', 'api');
CREATE TYPE calendar_provider AS ENUM ('google', 'outlook', 'caldav', 'ical');
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'webhook');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'delivered');

-- =============================================
-- TABLE: organizations
-- =============================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  plan plan_type DEFAULT 'free' NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  billing_email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  tax_id VARCHAR(100),
  
  -- Limites du plan
  monthly_call_limit INTEGER DEFAULT 100,
  monthly_calls_used INTEGER DEFAULT 0,
  assistant_limit INTEGER DEFAULT 1,
  user_limit INTEGER DEFAULT 1,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_plan ON organizations(plan);

-- =============================================
-- TABLE: profiles (Extension de auth.users)
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  phone VARCHAR(50),
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  language language DEFAULT 'fr',
  
  -- Préférences
  settings JSONB DEFAULT '{}'::jsonb,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  
  -- Activité
  last_seen_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =============================================
-- TABLE: team_members (Invitations d'équipe)
-- =============================================

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_team_invitations_org ON team_invitations(organization_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_invitations_token ON team_invitations(token);

-- =============================================
-- TABLE: assistants
-- =============================================

CREATE TABLE IF NOT EXISTS assistants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type assistant_type NOT NULL DEFAULT 'info',
  language language NOT NULL DEFAULT 'fr',
  
  -- Configuration voix
  voice_id VARCHAR(100),
  voice_settings JSONB DEFAULT '{}'::jsonb,
  
  -- Prompts & Messages
  system_prompt TEXT,
  first_message TEXT,
  end_call_phrases TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Intégrations
  vapi_assistant_id VARCHAR(100) UNIQUE,
  phone_number VARCHAR(50),
  
  -- Configuration
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Limites
  max_duration_seconds INTEGER DEFAULT 600,
  max_idle_seconds INTEGER DEFAULT 30,
  
  -- Transfert d'appels
  transfer_numbers JSONB DEFAULT '[]'::jsonb,
  
  -- Statistiques
  total_calls INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_assistants_org ON assistants(organization_id);
CREATE INDEX idx_assistants_type ON assistants(type);
CREATE INDEX idx_assistants_vapi ON assistants(vapi_assistant_id);
CREATE INDEX idx_assistants_active ON assistants(is_active);

-- =============================================
-- TABLE: contacts
-- =============================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informations de base
  phone VARCHAR(50) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  company VARCHAR(255),
  
  -- Informations supplémentaires
  job_title VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  
  -- Organisation
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  lists TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Consentements
  opted_in_sms BOOLEAN DEFAULT false,
  opted_in_email BOOLEAN DEFAULT false,
  do_not_call BOOLEAN DEFAULT false,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  -- Activité
  last_contact_at TIMESTAMPTZ,
  total_calls INTEGER DEFAULT 0,
  total_appointments INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(organization_id, phone)
);

CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX idx_contacts_name ON contacts(first_name, last_name);

-- =============================================
-- TABLE: call_logs
-- =============================================

CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assistant_id UUID REFERENCES assistants(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  
  -- Identifiants externes
  vapi_call_id VARCHAR(100) UNIQUE,
  external_id VARCHAR(255),
  
  -- Détails de l'appel
  direction call_direction NOT NULL DEFAULT 'inbound',
  caller_number VARCHAR(50),
  recipient_number VARCHAR(50),
  status call_status NOT NULL DEFAULT 'in_progress',
  
  -- Timing
  duration_seconds INTEGER DEFAULT 0,
  talk_time_seconds INTEGER DEFAULT 0,
  wait_time_seconds INTEGER DEFAULT 0,
  
  -- Contenu
  transcript TEXT,
  summary TEXT,
  sentiment sentiment,
  
  -- Média
  recording_url TEXT,
  recording_duration INTEGER,
  
  -- Analyse
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  intent VARCHAR(255),
  
  -- Facturation
  cost DECIMAL(10, 4),
  cost_breakdown JSONB DEFAULT '{}'::jsonb,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  
  -- Dates
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_call_logs_org ON call_logs(organization_id);
CREATE INDEX idx_call_logs_assistant ON call_logs(assistant_id);
CREATE INDEX idx_call_logs_contact ON call_logs(contact_id);
CREATE INDEX idx_call_logs_vapi ON call_logs(vapi_call_id);
CREATE INDEX idx_call_logs_status ON call_logs(status);
CREATE INDEX idx_call_logs_created ON call_logs(created_at DESC);
CREATE INDEX idx_call_logs_started ON call_logs(started_at DESC);
CREATE INDEX idx_call_logs_direction ON call_logs(direction);

-- =============================================
-- TABLE: appointments
-- =============================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assistant_id UUID REFERENCES assistants(id) ON DELETE SET NULL,
  call_log_id UUID REFERENCES call_logs(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  
  -- Détails du RDV
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  location_type VARCHAR(50), -- 'office', 'phone', 'video', 'home'
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  
  -- Status
  status appointment_status DEFAULT 'scheduled' NOT NULL,
  
  -- Participants
  attendees JSONB DEFAULT '[]'::jsonb,
  
  -- Intégrations
  external_calendar_id VARCHAR(255),
  external_event_id VARCHAR(255),
  calendar_provider calendar_provider,
  
  -- Rappels
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  reminders JSONB DEFAULT '[{"minutes_before": 1440, "type": "email"}]'::jsonb,
  
  -- Annulation
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_appointments_org ON appointments(organization_id);
CREATE INDEX idx_appointments_assistant ON appointments(assistant_id);
CREATE INDEX idx_appointments_contact ON appointments(contact_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start ON appointments(start_time);
CREATE INDEX idx_appointments_calendar ON appointments(external_calendar_id);

-- =============================================
-- TABLE: campaigns
-- =============================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  assistant_id UUID NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
  
  -- Informations de base
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type campaign_type NOT NULL DEFAULT 'custom',
  status campaign_status DEFAULT 'draft' NOT NULL,
  
  -- Planification
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Configuration
  settings JSONB DEFAULT '{
    "max_attempts": 3,
    "concurrent_calls": 5,
    "retry_delay_minutes": 60,
    "call_window_start": "09:00",
    "call_window_end": "18:00"
  }'::jsonb,
  
  -- Statistiques
  stats JSONB DEFAULT '{
    "total_contacts": 0,
    "calls_made": 0,
    "calls_answered": 0,
    "calls_failed": 0,
    "calls_completed": 0,
    "success_rate": 0,
    "avg_duration": 0,
    "total_cost": 0
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX idx_campaigns_assistant ON campaigns(assistant_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_scheduled ON campaigns(scheduled_at);

-- =============================================
-- TABLE: campaign_contacts (Relation Many-to-Many)
-- =============================================

CREATE TABLE IF NOT EXISTS campaign_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'calling', 'completed', 'failed', 'skipped'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Résultat
  call_log_id UUID REFERENCES call_logs(id),
  result VARCHAR(100), -- 'answered', 'no_answer', 'busy', 'failed'
  
  -- Timing
  last_attempt_at TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(campaign_id, contact_id)
);

CREATE INDEX idx_campaign_contacts_campaign ON campaign_contacts(campaign_id);
CREATE INDEX idx_campaign_contacts_contact ON campaign_contacts(contact_id);
CREATE INDEX idx_campaign_contacts_status ON campaign_contacts(status);
CREATE INDEX idx_campaign_contacts_next_attempt ON campaign_contacts(next_attempt_at);

-- =============================================
-- TABLE: subscriptions
-- =============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Détails de l'abonnement
  plan plan_type NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  
  -- Stripe
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  
  -- Facturation
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  
  -- Tarification
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  billing_interval VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
  
  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- =============================================
-- TABLE: invoices
-- =============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Numéro de facture
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  
  -- Stripe
  stripe_invoice_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255),
  
  -- Montants
  amount_due DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Status
  status invoice_status DEFAULT 'draft' NOT NULL,
  
  -- Dates
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- URLs
  hosted_invoice_url TEXT,
  invoice_pdf_url TEXT,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  line_items JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

-- =============================================
-- TABLE: api_keys
-- =============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Clé
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  
  -- Permissions
  permissions TEXT[] DEFAULT ARRAY['read', 'write']::TEXT[],
  scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Usage
  last_used_at TIMESTAMPTZ,
  last_used_ip VARCHAR(45),
  usage_count INTEGER DEFAULT 0,
  
  -- Limites
  rate_limit INTEGER, -- requêtes par minute
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- =============================================
-- TABLE: webhooks
-- =============================================

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Configuration
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  
  -- Sécurité
  secret VARCHAR(255),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Statistiques
  last_triggered_at TIMESTAMPTZ,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_error TEXT,
  
  -- Retry
  retry_on_failure BOOLEAN DEFAULT true,
  max_retries INTEGER DEFAULT 3,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_webhooks_org ON webhooks(organization_id);
CREATE INDEX idx_webhooks_active ON webhooks(is_active);

-- =============================================
-- TABLE: webhook_logs
-- =============================================

CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  
  -- Détails
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  
  -- Réponse
  status_code INTEGER,
  response_body TEXT,
  response_time_ms INTEGER,
  
  -- Erreur
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_created ON webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_event ON webhook_logs(event_type);

-- =============================================
-- TABLE: integrations
-- =============================================

CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Type
  type integration_type NOT NULL,
  provider VARCHAR(100) NOT NULL, -- 'google', 'stripe', 'hubspot', etc.
  
  -- Configuration
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Credentials (chiffrées)
  credentials JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- OAuth
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Sync
  last_sync_at TIMESTAMPTZ,
  sync_status VARCHAR(50),
  sync_error TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_integrations_org ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_provider ON integrations(provider);

-- =============================================
-- TABLE: calendar_events
-- =============================================

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Identifiants externes
  external_event_id VARCHAR(255) NOT NULL,
  calendar_id VARCHAR(255) NOT NULL,
  
  -- Détails
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  
  -- Synchronisation
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(integration_id, external_event_id)
);

CREATE INDEX idx_calendar_events_org ON calendar_events(organization_id);
CREATE INDEX idx_calendar_events_integration ON calendar_events(integration_id);
CREATE INDEX idx_calendar_events_appointment ON calendar_events(appointment_id);
CREATE INDEX idx_calendar_events_start ON calendar_events(start_time);

-- =============================================
-- TABLE: notifications
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Type et contenu
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Cible
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  
  -- Status
  status notification_status DEFAULT 'pending' NOT NULL,
  
  -- Métadonnées
  data JSONB DEFAULT '{}'::jsonb,
  error TEXT,
  
  -- Dates
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_org ON notifications(organization_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);

-- =============================================
-- TABLE: audit_logs
-- =============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Action
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  
  -- Détails
  changes JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Context
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- =============================================
-- TABLE: usage_metrics
-- =============================================

CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Période
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Métriques d'appels
  total_calls INTEGER DEFAULT 0,
  inbound_calls INTEGER DEFAULT 0,
  outbound_calls INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  
  -- Métriques financières
  total_cost DECIMAL(10, 4) DEFAULT 0,
  cost_per_call DECIMAL(10, 4) DEFAULT 0,
  
  -- Métriques de qualité
  avg_duration_seconds INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0,
  
  -- Assistants
  assistants_used INTEGER DEFAULT 0,
  
  -- Autres
  appointments_created INTEGER DEFAULT 0,
  campaigns_run INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(organization_id, period_start)
);

CREATE INDEX idx_usage_metrics_org ON usage_metrics(organization_id);
CREATE INDEX idx_usage_metrics_period ON usage_metrics(period_start, period_end);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES: Organizations
-- =============================================

CREATE POLICY "Users can view own organization" 
  ON organizations FOR SELECT 
  USING (id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Org admins can update organization" 
  ON organizations FOR UPDATE 
  USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

-- =============================================
-- POLICIES: Profiles
-- =============================================

CREATE POLICY "Users can view profiles in their organization" 
  ON profiles FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (id = auth.uid());

-- =============================================
-- POLICIES: Team Invitations
-- =============================================

CREATE POLICY "Admins can manage team invitations" 
  ON team_invitations FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

-- =============================================
-- POLICIES: Assistants
-- =============================================

CREATE POLICY "Users can view assistants in their organization" 
  ON assistants FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage assistants" 
  ON assistants FOR ALL 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- POLICIES: Contacts
-- =============================================

CREATE POLICY "Users can manage contacts" 
  ON contacts FOR ALL 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- POLICIES: Call Logs
-- =============================================

CREATE POLICY "Users can view call logs" 
  ON call_logs FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "System can insert call logs" 
  ON call_logs FOR INSERT 
  WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- POLICIES: Appointments
-- =============================================

CREATE POLICY "Users can manage appointments" 
  ON appointments FOR ALL 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- POLICIES: Campaigns
-- =============================================

CREATE POLICY "Users can manage campaigns" 
  ON campaigns FOR ALL 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage campaign contacts" 
  ON campaign_contacts FOR ALL 
  USING (
    campaign_id IN (
      SELECT id FROM campaigns 
      WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

-- =============================================
-- POLICIES: Subscriptions & Invoices
-- =============================================

CREATE POLICY "Admins can view subscriptions" 
  ON subscriptions FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can view invoices" 
  ON invoices FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

-- =============================================
-- POLICIES: API Keys & Webhooks
-- =============================================

CREATE POLICY "Admins can manage API keys" 
  ON api_keys FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can manage webhooks" 
  ON webhooks FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can view webhook logs" 
  ON webhook_logs FOR SELECT 
  USING (
    webhook_id IN (
      SELECT id FROM webhooks 
      WHERE organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
      )
    )
  );

-- =============================================
-- POLICIES: Integrations
-- =============================================

CREATE POLICY "Users can view integrations" 
  ON integrations FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage integrations" 
  ON integrations FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

-- =============================================
-- POLICIES: Calendar Events
-- =============================================

CREATE POLICY "Users can view calendar events" 
  ON calendar_events FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- POLICIES: Notifications
-- =============================================

CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (user_id = auth.uid());

-- =============================================
-- POLICIES: Audit Logs
-- =============================================

CREATE POLICY "Admins can view audit logs" 
  ON audit_logs FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('org_admin', 'super_admin')
    )
  );

-- =============================================
-- POLICIES: Usage Metrics
-- =============================================

CREATE POLICY "Users can view usage metrics" 
  ON usage_metrics FOR SELECT 
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- TRIGGERS: Updated At
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated 
  BEFORE UPDATE ON organizations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_profiles_updated 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_assistants_updated 
  BEFORE UPDATE ON assistants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_contacts_updated 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_appointments_updated 
  BEFORE UPDATE ON appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_campaigns_updated 
  BEFORE UPDATE ON campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_campaign_contacts_updated 
  BEFORE UPDATE ON campaign_contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_subscriptions_updated 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_invoices_updated 
  BEFORE UPDATE ON invoices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_webhooks_updated 
  BEFORE UPDATE ON webhooks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_integrations_updated 
  BEFORE UPDATE ON integrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_calendar_events_updated 
  BEFORE UPDATE ON calendar_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- FUNCTIONS: User Management
-- =============================================

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
    VALUES (
      org_name, 
      LOWER(REPLACE(REGEXP_REPLACE(org_name, '[^a-zA-Z0-9\s-]', '', 'g'), ' ', '-')) || '-' || SUBSTRING(NEW.id::TEXT, 1, 8)
    )
    RETURNING id INTO org_id;
  END IF;
  
  -- Créer profil
  INSERT INTO profiles (id, email, full_name, organization_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    org_id,
    CASE WHEN org_id IS NOT NULL THEN 'org_admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- FUNCTIONS: Update Contact Stats
-- =============================================

CREATE OR REPLACE FUNCTION update_contact_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE contacts
    SET 
      total_calls = total_calls + 1,
      last_contact_at = NEW.created_at
    WHERE id = NEW.contact_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_contact_stats
  AFTER INSERT ON call_logs
  FOR EACH ROW
  WHEN (NEW.contact_id IS NOT NULL)
  EXECUTE FUNCTION update_contact_stats();

-- =============================================
-- FUNCTIONS: Update Assistant Stats
-- =============================================

CREATE OR REPLACE FUNCTION update_assistant_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'completed') THEN
    UPDATE assistants
    SET 
      total_calls = total_calls + 1,
      total_minutes = total_minutes + COALESCE(NEW.duration_seconds, 0) / 60
    WHERE id = NEW.assistant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_assistant_stats
  AFTER INSERT OR UPDATE ON call_logs
  FOR EACH ROW
  WHEN (NEW.assistant_id IS NOT NULL AND NEW.status = 'completed')
  EXECUTE FUNCTION update_assistant_stats();

-- =============================================
-- FUNCTIONS: Update Organization Usage
-- =============================================

CREATE OR REPLACE FUNCTION update_org_monthly_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE organizations
    SET monthly_calls_used = monthly_calls_used + 1
    WHERE id = NEW.organization_id
      AND DATE_TRUNC('month', NOW()) = DATE_TRUNC('month', NEW.created_at);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_org_usage
  AFTER INSERT OR UPDATE ON call_logs
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_org_monthly_usage();

-- =============================================
-- FUNCTIONS: Audit Logging
-- =============================================

CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Récupérer l'organization_id selon la table
  IF TG_TABLE_NAME = 'organizations' THEN
    org_id := NEW.id;
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    org_id := NEW.organization_id;
  ELSE
    org_id := NEW.organization_id;
  END IF;

  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    resource_type,
    resource_id,
    changes
  ) VALUES (
    org_id,
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    CASE 
      WHEN TG_OP = 'UPDATE' THEN 
        jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      ELSE 
        to_jsonb(NEW)
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Appliquer l'audit sur les tables importantes
CREATE TRIGGER tr_audit_organizations
  AFTER INSERT OR UPDATE OR DELETE ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER tr_audit_assistants
  AFTER INSERT OR UPDATE OR DELETE ON assistants
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- =============================================
-- VIEWS UTILES
-- =============================================

-- Vue: Statistiques des assistants
CREATE OR REPLACE VIEW assistant_stats AS
SELECT 
  a.id,
  a.organization_id,
  a.name,
  a.type,
  COUNT(DISTINCT cl.id) as total_calls,
  COALESCE(SUM(cl.duration_seconds), 0) as total_duration_seconds,
  COALESCE(AVG(cl.duration_seconds), 0) as avg_duration_seconds,
  COALESCE(SUM(cl.cost), 0) as total_cost,
  COUNT(DISTINCT CASE WHEN cl.status = 'completed' THEN cl.id END) as successful_calls,
  COUNT(DISTINCT ap.id) as appointments_created
FROM assistants a
LEFT JOIN call_logs cl ON a.id = cl.assistant_id
LEFT JOIN appointments ap ON a.id = ap.assistant_id
GROUP BY a.id, a.organization_id, a.name, a.type;

-- Vue: Dashboard metrics
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
  o.id as organization_id,
  COUNT(DISTINCT cl.id) FILTER (WHERE cl.created_at >= NOW() - INTERVAL '30 days') as calls_last_30d,
  COUNT(DISTINCT cl.id) FILTER (WHERE cl.created_at >= NOW() - INTERVAL '7 days') as calls_last_7d,
  COUNT(DISTINCT ap.id) FILTER (WHERE ap.created_at >= NOW() - INTERVAL '30 days') as appointments_last_30d,
  COUNT(DISTINCT c.id) as total_contacts,
  COUNT(DISTINCT a.id) as total_assistants,
  COALESCE(SUM(cl.cost) FILTER (WHERE cl.created_at >= NOW() - INTERVAL '30 days'), 0) as cost_last_30d
FROM organizations o
LEFT JOIN call_logs cl ON o.id = cl.organization_id
LEFT JOIN appointments ap ON o.id = ap.organization_id
LEFT JOIN contacts c ON o.id = c.organization_id
LEFT JOIN assistants a ON o.id = a.organization_id
GROUP BY o.id;

-- =============================================
-- COMMENTAIRES
-- =============================================

COMMENT ON TABLE organizations IS 'Organisations/Entreprises utilisant la plateforme';
COMMENT ON TABLE profiles IS 'Profils utilisateurs liés aux comptes auth.users';
COMMENT ON TABLE assistants IS 'Assistants IA configurés par organisation';
COMMENT ON TABLE call_logs IS 'Historique de tous les appels';
COMMENT ON TABLE appointments IS 'Rendez-vous planifiés';
COMMENT ON TABLE campaigns IS 'Campagnes d''appels sortants';
COMMENT ON TABLE subscriptions IS 'Abonnements et facturation';
COMMENT ON TABLE webhooks IS 'Configuration des webhooks';
COMMENT ON TABLE integrations IS 'Intégrations tierces (calendrier, CRM, etc.)';

-- =============================================
-- FIN DU SCHÉMA
-- =============================================
