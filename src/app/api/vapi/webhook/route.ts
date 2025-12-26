import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * Vérifie la signature HMAC du webhook VAPI
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null,
  timestamp: string | null
): boolean {
  if (!signature || !timestamp) {
    return false;
  }

  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    console.error("VAPI_WEBHOOK_SECRET not configured");
    return false;
  }

  // Vérifier que le timestamp n'est pas trop ancien (max 5 minutes)
  const timestampMs = parseInt(timestamp);
  if (isNaN(timestampMs) || Math.abs(Date.now() - timestampMs) > 300000) {
    console.error("Webhook timestamp too old or invalid");
    return false;
  }

  // Calculer la signature attendue
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(timestamp + body)
    .digest("hex");

  // Comparaison sécurisée pour éviter timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // 1. Récupérer le body en texte pour vérification signature
    const bodyText = await request.text();
    
    // 2. Vérifier la signature HMAC
    const signature = request.headers.get("x-vapi-signature");
    const timestamp = request.headers.get("x-vapi-timestamp");
    
    if (!verifyWebhookSignature(bodyText, signature, timestamp)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 3. Parser le body après vérification
    const body = JSON.parse(bodyText);
    const { type, call, message } = body;

    const supabase = await createAdminClient();

    // === ÉVÉNEMENT: Appel démarré ===
    if (type === "call-started" || type === "call.started") {
      await supabase.from("call_logs").insert({
        vapi_call_id: call.id,
        organization_id: call.metadata?.organization_id,
        assistant_id: call.metadata?.assistant_id,
        contact_id: call.metadata?.contact_id,
        campaign_id: call.metadata?.campaign_id,
        direction: call.type === "inboundPhoneCall" ? "inbound" : "outbound",
        caller_number: call.customer?.number,
        status: "in_progress",
        duration_seconds: 0,
        started_at: new Date().toISOString(),
      });
    }

    // === ÉVÉNEMENT: Appel terminé ===
    if (type === "call-ended" || type === "call.ended") {
      const { data: existingCall } = await supabase
        .from("call_logs")
        .select("id, campaign_id")
        .eq("vapi_call_id", call.id)
        .single();

      if (existingCall) {
        const status = determineCallStatus(call.endedReason);
        
        await supabase.from("call_logs").update({
          status,
          duration_seconds: Math.round(call.duration || 0),
          transcript: call.transcript,
          summary: call.summary,
          recording_url: call.recordingUrl,
          cost: call.cost,
          sentiment: analyzeSentiment(call.summary, call.transcript),
          ended_at: new Date().toISOString(),
        }).eq("id", existingCall.id);

        // Mettre à jour le contact de campagne si applicable
        if (existingCall.campaign_id) {
          await supabase
            .from("campaign_contacts")
            .update({
              status: status === "completed" ? "completed" : "failed",
              result: call.endedReason,
              completed_at: new Date().toISOString(),
            })
            .eq("call_log_id", existingCall.id);

          // Mettre à jour les stats de la campagne
          const { CampaignService } = await import("@/lib/vapi/campaigns");
          await CampaignService.updateCampaignStats(existingCall.campaign_id);
        }
      }
    }

    // === ÉVÉNEMENT: Message reçu (transcription en temps réel) ===
    if (type === "transcript" || type === "message") {
      await supabase.from("call_logs").update({
        transcript: message?.transcript || body.transcript,
      }).eq("vapi_call_id", call?.id || body.call?.id);
    }

    // === ÉVÉNEMENT: Transfert d'appel ===
    if (type === "call-forwarding-started" || type === "transfer") {
      await supabase.from("call_logs").update({
        status: "transferred",
        metadata: { transfer_number: body.phoneNumber },
      }).eq("vapi_call_id", call.id);
    }

    // === ÉVÉNEMENT: Rendez-vous créé ===
    if (type === "appointment-booked" || type === "function-call") {
      if (body.functionName === "book_appointment" && body.result) {
        const appointmentData = JSON.parse(body.result);
        
        const { data: callLog } = await supabase
          .from("call_logs")
          .select("organization_id, contact_id")
          .eq("vapi_call_id", call.id)
          .single();

        if (callLog) {
          await supabase.from("appointments").insert({
            organization_id: callLog.organization_id,
            contact_id: callLog.contact_id,
            call_log_id: call.id,
            title: appointmentData.title || "Rendez-vous",
            scheduled_at: appointmentData.date,
            duration_minutes: appointmentData.duration || 30,
            status: "scheduled",
            notes: appointmentData.notes,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Détermine le statut de l'appel selon la raison de fin
 */
function determineCallStatus(endedReason: string): string {
  const statusMap: Record<string, string> = {
    "customer-ended-call": "completed",
    "assistant-ended-call": "completed",
    "customer-did-not-answer": "missed",
    "customer-busy": "missed",
    "assistant-forwarded-call": "transferred",
    "voicemail": "missed",
    "error": "failed",
  };

  return statusMap[endedReason] || "completed";
}

/**
 * Analyse le sentiment de l'appel
 */
function analyzeSentiment(summary?: string, transcript?: string): string {
  if (!summary && !transcript) return "neutral";

  const text = (summary + " " + transcript).toLowerCase();
  
  const positiveWords = ["merci", "parfait", "excellent", "satisfait", "content", "bien"];
  const negativeWords = ["problème", "mécontent", "pas content", "mauvais", "déçu"];

  const positiveCount = positiveWords.filter((word) => text.includes(word)).length;
  const negativeCount = negativeWords.filter((word) => text.includes(word)).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}
