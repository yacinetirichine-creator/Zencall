// =============================================
// TYPES ÉNUMÉRÉS
// =============================================

export type UserRole = "super_admin" | "org_admin" | "user";
export type AssistantType = "astreinte" | "rdv" | "info" | "outbound";
export type Language = "fr" | "es" | "en" | "nl" | "ar";
export type CallStatus = "completed" | "missed" | "transferred" | "failed" | "in_progress";
export type CallDirection = "inbound" | "outbound";
export type Sentiment = "positive" | "neutral" | "negative";
export type AppointmentStatus = "scheduled" | "confirmed" | "cancelled" | "completed" | "no_show";
export type CampaignStatus = "draft" | "scheduled" | "running" | "paused" | "completed";
export type CampaignType = "reminder" | "payment" | "survey" | "custom";
export type PlanType = "free" | "starter" | "pro" | "business" | "agency" | "enterprise";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing" | "incomplete";
export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible";
export type IntegrationType = "calendar" | "crm" | "payment" | "webhook" | "api";
export type CalendarProvider = "google" | "outlook" | "caldav" | "ical";
export type NotificationType = "email" | "sms" | "push" | "webhook";
export type NotificationStatus = "pending" | "sent" | "failed" | "delivered";

// =============================================
// INTERFACES
// =============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: PlanType;
  settings: Record<string, unknown>;
  billing_email: string | null;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  monthly_call_limit: number;
  monthly_calls_used: number;
  assistant_limit: number;
  user_limit: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Profile {
  id: string;
  organization_id: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  timezone: string;
  language: Language;
  settings: Record<string, unknown>;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  last_seen_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamInvitation {
  id: string;
  organization_id: string;
  inviter_id: string | null;
  email: string;
  role: UserRole;
  token: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface Assistant {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  type: AssistantType;
  language: Language;
  voice_id: string | null;
  voice_settings: Record<string, unknown>;
  system_prompt: string | null;
  first_message: string | null;
  end_call_phrases: string[];
  vapi_assistant_id: string | null;
  phone_number: string | null;
  is_active: boolean;
  settings: Record<string, unknown>;
  max_duration_seconds: number;
  max_idle_seconds: number;
  transfer_numbers: Array<{
    name: string;
    number: string;
    priority: number;
  }>;
  total_calls: number;
  total_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface CallLog {
  id: string;
  organization_id: string;
  assistant_id: string | null;
  contact_id: string | null;
  vapi_call_id: string | null;
  external_id: string | null;
  direction: CallDirection;
  caller_number: string | null;
  recipient_number: string | null;
  status: CallStatus;
  duration_seconds: number;
  talk_time_seconds: number;
  wait_time_seconds: number;
  transcript: string | null;
  summary: string | null;
  sentiment: Sentiment | null;
  recording_url: string | null;
  recording_duration: number | null;
  keywords: string[];
  intent: string | null;
  cost: number | null;
  cost_breakdown: Record<string, unknown>;
  metadata: Record<string, unknown>;
  error_message: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  phone: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company: string | null;
  job_title: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  tags: string[];
  lists: string[];
  opted_in_sms: boolean;
  opted_in_email: boolean;
  do_not_call: boolean;
  metadata: Record<string, unknown>;
  custom_fields: Record<string, unknown>;
  last_contact_at: string | null;
  total_calls: number;
  total_appointments: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  organization_id: string;
  assistant_id: string | null;
  call_log_id: string | null;
  contact_id: string | null;
  title: string;
  description: string | null;
  location: string | null;
  location_type: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  status: AppointmentStatus;
  attendees: Array<{
    name: string;
    email: string;
    phone?: string;
  }>;
  external_calendar_id: string | null;
  external_event_id: string | null;
  calendar_provider: CalendarProvider | null;
  reminder_sent: boolean;
  reminder_sent_at: string | null;
  reminders: Array<{
    minutes_before: number;
    type: string;
  }>;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  metadata: Record<string, unknown>;
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  organization_id: string;
  assistant_id: string;
  name: string;
  description: string | null;
  type: CampaignType;
  status: CampaignStatus;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  settings: {
    max_attempts: number;
    concurrent_calls: number;
    retry_delay_minutes: number;
    call_window_start: string;
    call_window_end: string;
  };
  stats: {
    total_contacts: number;
    calls_made: number;
    calls_answered: number;
    calls_failed: number;
    calls_completed: number;
    success_rate: number;
    avg_duration: number;
    total_cost: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CampaignContact {
  id: string;
  campaign_id: string;
  contact_id: string;
  status: string;
  attempts: number;
  max_attempts: number;
  call_log_id: string | null;
  result: string | null;
  last_attempt_at: string | null;
  next_attempt_at: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  amount: number | null;
  currency: string;
  billing_interval: string;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id: string | null;
  invoice_number: string;
  stripe_invoice_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: InvoiceStatus;
  period_start: string | null;
  period_end: string | null;
  due_date: string | null;
  paid_at: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf_url: string | null;
  metadata: Record<string, unknown>;
  line_items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  created_by: string | null;
  name: string;
  key_hash: string;
  key_prefix: string;
  permissions: string[];
  scopes: string[];
  last_used_at: string | null;
  last_used_ip: string | null;
  usage_count: number;
  rate_limit: number | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface Webhook {
  id: string;
  organization_id: string;
  created_by: string | null;
  name: string;
  url: string;
  events: string[];
  secret: string | null;
  is_active: boolean;
  last_triggered_at: string | null;
  success_count: number;
  failure_count: number;
  last_error: string | null;
  retry_on_failure: boolean;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status_code: number | null;
  response_body: string | null;
  response_time_ms: number | null;
  error: string | null;
  retry_count: number;
  created_at: string;
}

export interface Integration {
  id: string;
  organization_id: string;
  type: IntegrationType;
  provider: string;
  name: string;
  is_active: boolean;
  credentials: Record<string, unknown>;
  settings: Record<string, unknown>;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  last_sync_at: string | null;
  sync_status: string | null;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  organization_id: string;
  integration_id: string | null;
  appointment_id: string | null;
  external_event_id: string;
  calendar_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  recipient_email: string | null;
  recipient_phone: string | null;
  status: NotificationStatus;
  data: Record<string, unknown>;
  error: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  changes: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface UsageMetric {
  id: string;
  organization_id: string;
  period_start: string;
  period_end: string;
  total_calls: number;
  inbound_calls: number;
  outbound_calls: number;
  total_minutes: number;
  total_cost: number;
  cost_per_call: number;
  avg_duration_seconds: number;
  success_rate: number;
  assistants_used: number;
  appointments_created: number;
  campaigns_run: number;
  created_at: string;
}

// =============================================
// VUES SQL
// =============================================

export interface AssistantStats {
  id: string;
  organization_id: string;
  name: string;
  type: AssistantType;
  total_calls: number;
  total_duration_seconds: number;
  avg_duration_seconds: number;
  total_cost: number;
  successful_calls: number;
  appointments_created: number;
}

export interface DashboardMetrics {
  organization_id: string;
  calls_last_30d: number;
  calls_last_7d: number;
  appointments_last_30d: number;
  total_contacts: number;
  total_assistants: number;
  cost_last_30d: number;
}

// =============================================
// TYPES UTILITAIRES
// =============================================

export interface Database {
  public: {
    Tables: {
      organizations: { Row: Organization };
      profiles: { Row: Profile };
      team_invitations: { Row: TeamInvitation };
      assistants: { Row: Assistant };
      contacts: { Row: Contact };
      call_logs: { Row: CallLog };
      appointments: { Row: Appointment };
      campaigns: { Row: Campaign };
      campaign_contacts: { Row: CampaignContact };
      subscriptions: { Row: Subscription };
      invoices: { Row: Invoice };
      api_keys: { Row: ApiKey };
      webhooks: { Row: Webhook };
      webhook_logs: { Row: WebhookLog };
      integrations: { Row: Integration };
      calendar_events: { Row: CalendarEvent };
      notifications: { Row: Notification };
      audit_logs: { Row: AuditLog };
      usage_metrics: { Row: UsageMetric };
    };
    Views: {
      assistant_stats: { Row: AssistantStats };
      dashboard_metrics: { Row: DashboardMetrics };
    };
  };
}
