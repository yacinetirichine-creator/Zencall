import { z } from "zod";

/**
 * Schémas de validation pour les assistants
 */
export const createAssistantSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255, "Le nom est trop long"),
  type: z.enum(["astreinte", "rdv", "info", "outbound"], {
    errorMap: () => ({ message: "Type invalide" }),
  }),
  language: z.enum(["fr", "es", "en", "nl", "ar"], {
    errorMap: () => ({ message: "Langue invalide" }),
  }),
  vapi_assistant_id: z.string().optional().nullable(),
  system_prompt: z.string().max(5000, "Le prompt est trop long").optional().nullable(),
  first_message: z.string().max(500, "Le premier message est trop long").optional().nullable(),
  voice_id: z.string().max(100).optional().nullable(),
  webhook_url: z.string().url("URL invalide").optional().nullable(),
  forwarding_number: z.string().max(20).optional().nullable(),
  max_duration_seconds: z.number().int().min(0).max(3600).optional().nullable(),
  temperature: z.number().min(0).max(1).optional().nullable(),
  enable_transcription: z.boolean().optional().default(true),
  enable_recording: z.boolean().optional().default(true),
  enable_sentiment: z.boolean().optional().default(false),
  metadata: z.record(z.any()).optional().nullable(),
});

export const updateAssistantSchema = createAssistantSchema.partial();

/**
 * Schémas de validation pour les contacts
 */
export const createContactSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis").max(100),
  last_name: z.string().max(100).optional().nullable(),
  email: z.string().email("Email invalide").optional().nullable(),
  phone: z.string().min(1, "Le téléphone est requis").max(20),
  company: z.string().max(200).optional().nullable(),
  position: z.string().max(100).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  custom_fields: z.record(z.any()).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  opted_in: z.boolean().optional().default(false),
  do_not_call: z.boolean().optional().default(false),
});

export const updateContactSchema = createContactSchema.partial();

/**
 * Schémas de validation pour les rendez-vous
 */
export const createAppointmentSchema = z.object({
  contact_id: z.string().uuid("Contact ID invalide"),
  assistant_id: z.string().uuid("Assistant ID invalide").optional().nullable(),
  call_log_id: z.string().uuid("Call log ID invalide").optional().nullable(),
  title: z.string().min(1, "Le titre est requis").max(255),
  description: z.string().max(2000).optional().nullable(),
  scheduled_at: z.string().datetime("Date/heure invalide"),
  duration_minutes: z.number().int().min(1).max(480).optional().default(30),
  location: z.string().max(500).optional().nullable(),
  attendees: z.array(z.string().email()).optional().default([]),
  reminder_minutes_before: z.number().int().min(0).max(10080).optional().nullable(),
  calendar_event_id: z.string().max(255).optional().nullable(),
  status: z.enum(["scheduled", "confirmed", "cancelled", "completed", "no_show"]).optional().default("scheduled"),
  metadata: z.record(z.any()).optional().nullable(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

/**
 * Schémas de validation pour les campagnes
 */
export const createCampaignSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  description: z.string().max(2000).optional().nullable(),
  assistant_id: z.string().uuid("Assistant ID invalide"),
  type: z.enum(["outbound_call", "outbound_sms", "mixed"], {
    errorMap: () => ({ message: "Type invalide" }),
  }),
  status: z.enum(["draft", "scheduled", "running", "paused", "completed", "cancelled"]).optional().default("draft"),
  scheduled_start: z.string().datetime().optional().nullable(),
  scheduled_end: z.string().datetime().optional().nullable(),
  target_contact_count: z.number().int().min(1).optional().nullable(),
  call_window_start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM requis").optional().nullable(),
  call_window_end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format HH:MM requis").optional().nullable(),
  timezone: z.string().max(50).optional().default("Europe/Paris"),
  max_attempts: z.number().int().min(1).max(10).optional().default(3),
  retry_delay_hours: z.number().int().min(1).max(168).optional().default(24),
  metadata: z.record(z.any()).optional().nullable(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

/**
 * Schémas de validation pour les webhooks
 */
export const createWebhookSchema = z.object({
  url: z.string().url("URL invalide"),
  events: z.array(z.enum([
    "call.started",
    "call.ended",
    "call.failed",
    "appointment.created",
    "appointment.confirmed",
    "appointment.cancelled",
    "campaign.started",
    "campaign.completed",
  ])).min(1, "Au moins un événement requis"),
  is_active: z.boolean().optional().default(true),
  secret: z.string().min(20, "Secret trop court").optional().nullable(),
  retry_count: z.number().int().min(0).max(10).optional().default(3),
  timeout_seconds: z.number().int().min(1).max(30).optional().default(10),
});

export const updateWebhookSchema = createWebhookSchema.partial();

/**
 * Schémas de validation pour les API Keys
 */
export const createApiKeySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  scopes: z.array(z.enum([
    "assistants:read",
    "assistants:write",
    "calls:read",
    "calls:write",
    "contacts:read",
    "contacts:write",
    "appointments:read",
    "appointments:write",
    "campaigns:read",
    "campaigns:write",
  ])).min(1, "Au moins une permission requise"),
  expires_at: z.string().datetime().optional().nullable(),
});

/**
 * Helper pour valider et parser les données
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `${firstError.path.join(".")}: ${firstError.message}` 
      };
    }
    return { success: false, error: "Validation error" };
  }
}
