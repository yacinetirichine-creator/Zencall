import { getVapiClient } from "./client";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Service de gestion des campagnes d'appels VAPI
 */
export class CampaignService {
  /**
   * Lance une campagne d'appels sortants
   */
  static async startCampaign(campaignId: string) {
    const supabase = await createAdminClient();
    
    // 1. Récupérer la campagne
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*, assistant:assistants(*)")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campagne introuvable");
    }

    if (!campaign.assistant?.vapi_assistant_id) {
      throw new Error("Assistant VAPI non configuré");
    }

    // 2. Récupérer les contacts de la campagne
    const { data: campaignContacts } = await supabase
      .from("campaign_contacts")
      .select("*, contact:contacts(*)")
      .eq("campaign_id", campaignId)
      .eq("status", "pending")
      .lt("attempts", supabase.rpc("max_attempts"));

    if (!campaignContacts || campaignContacts.length === 0) {
      throw new Error("Aucun contact à appeler");
    }

    // 3. Marquer la campagne comme en cours
    await supabase
      .from("campaigns")
      .update({
        status: "running",
        started_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    // 4. Lancer les appels (en respectant les limites de concurrence)
    const { concurrent_calls } = campaign.settings;
    const batches = this.createBatches(campaignContacts, concurrent_calls);

    for (const batch of batches) {
      await Promise.all(
        batch.map((cc) => this.makeOutboundCall(cc, campaign.assistant.vapi_assistant_id))
      );
    }

    // 5. Marquer la campagne comme terminée
    await supabase
      .from("campaigns")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    return { success: true };
  }

  /**
   * Effectue un appel sortant via VAPI
   */
  private static async makeOutboundCall(
    campaignContact: any,
    vapiAssistantId: string
  ) {
    const supabase = await createAdminClient();
    const vapiClient = getVapiClient();

    try {
      // 1. Vérifier fenêtre d'appel
      if (!this.isWithinCallWindow(campaignContact.campaign.settings)) {
        // Programmer pour plus tard
        await this.scheduleRetry(campaignContact);
        return;
      }

      // 2. Incrémenter tentatives
      await supabase
        .from("campaign_contacts")
        .update({
          attempts: (campaignContact.attempts || 0) + 1,
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", campaignContact.id);

      // 3. Créer l'appel via VAPI
      const call = await vapiClient.createCall({
        assistantId: vapiAssistantId,
        customer: {
          number: campaignContact.contact.phone,
          name: `${campaignContact.contact.first_name} ${campaignContact.contact.last_name}`,
        },
      });

      // 4. Créer le log d'appel
      const { data: callLog } = await supabase
        .from("call_logs")
        .insert({
          vapi_call_id: call.id,
          organization_id: campaignContact.campaign.organization_id,
          assistant_id: campaignContact.campaign.assistant_id,
          contact_id: campaignContact.contact_id,
          campaign_id: campaignContact.campaign_id,
          direction: "outbound",
          caller_number: campaignContact.contact.phone,
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      // 5. Lier le log au contact de campagne
      await supabase
        .from("campaign_contacts")
        .update({ call_log_id: callLog.id })
        .eq("id", campaignContact.id);

      return { success: true, call_id: call.id };
    } catch (error) {
      console.error("Erreur appel sortant:", error);

      // Marquer comme échoué
      await supabase
        .from("campaign_contacts")
        .update({
          status: "failed",
          result: "error",
        })
        .eq("id", campaignContact.id);

      // Programmer retry si possible
      if (campaignContact.attempts < campaignContact.max_attempts) {
        await this.scheduleRetry(campaignContact);
      }

      return { success: false, error };
    }
  }

  /**
   * Vérifie si on est dans la fenêtre d'appel autorisée
   */
  private static isWithinCallWindow(settings: any): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMin] = settings.call_window_start.split(":").map(Number);
    const [endHour, endMin] = settings.call_window_end.split(":").map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Programme une nouvelle tentative d'appel
   */
  private static async scheduleRetry(campaignContact: any) {
    const supabase = await createAdminClient();
    const retryDelayMinutes = campaignContact.campaign.settings.retry_delay_minutes || 60;
    
    const nextAttempt = new Date();
    nextAttempt.setMinutes(nextAttempt.getMinutes() + retryDelayMinutes);

    await supabase
      .from("campaign_contacts")
      .update({
        next_attempt_at: nextAttempt.toISOString(),
        status: "scheduled",
      })
      .eq("id", campaignContact.id);
  }

  /**
   * Crée des batches pour respecter la concurrence
   */
  private static createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Met à jour les statistiques de la campagne
   */
  static async updateCampaignStats(campaignId: string) {
    const supabase = await createAdminClient();

    const { data: contacts } = await supabase
      .from("campaign_contacts")
      .select("status, call_log:call_logs(duration_seconds, cost)")
      .eq("campaign_id", campaignId);

    if (!contacts) return;

    const stats = {
      total_contacts: contacts.length,
      calls_made: contacts.filter((c) => c.status !== "pending").length,
      calls_answered: contacts.filter((c) => c.status === "completed").length,
      calls_failed: contacts.filter((c) => c.status === "failed").length,
      calls_completed: contacts.filter((c) => c.status === "completed").length,
      success_rate: 0,
      avg_duration: 0,
      total_cost: 0,
    };

    if (stats.calls_made > 0) {
      stats.success_rate = (stats.calls_completed / stats.calls_made) * 100;
    }

    const durations = (contacts as any[])
      .map((c) => {
        const callLog = Array.isArray(c.call_log) ? c.call_log[0] : c.call_log;
        return callLog?.duration_seconds;
      })
      .filter((v) => typeof v === "number" && Number.isFinite(v));
    
    if (durations.length > 0) {
      stats.avg_duration = durations.reduce((a, b) => a + b, 0) / durations.length;
    }

    const costs = (contacts as any[])
      .map((c) => {
        const callLog = Array.isArray(c.call_log) ? c.call_log[0] : c.call_log;
        return callLog?.cost;
      })
      .filter((v) => typeof v === "number" && Number.isFinite(v));
    
    if (costs.length > 0) {
      stats.total_cost = costs.reduce((a, b) => a + b, 0);
    }

    await supabase
      .from("campaigns")
      .update({ stats })
      .eq("id", campaignId);
  }
}
