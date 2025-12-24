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
    const { type, call } = body;

    const supabase = await createAdminClient();

    if (type === "call-started") {
      await supabase.from("call_logs").insert({
        vapi_call_id: call.id,
        organization_id: call.metadata?.organization_id,
        assistant_id: call.metadata?.assistant_id,
        direction: call.type === "inboundPhoneCall" ? "inbound" : "outbound",
        caller_number: call.customer?.number,
        status: "in_progress",
        duration_seconds: 0,
        started_at: new Date().toISOString(),
      });
    }

    if (type === "call-ended") {
      const { data: existingCall } = await supabase
        .from("call_logs")
        .select("id")
        .eq("vapi_call_id", call.id)
        .single();

      if (existingCall) {
        await supabase.from("call_logs").update({
          status: call.endedReason === "customer-ended-call" ? "completed" : "failed",
          duration_seconds: Math.round(call.duration || 0),
          transcript: call.transcript,
          summary: call.summary,
          recording_url: call.recordingUrl,
          cost: call.cost,
          ended_at: new Date().toISOString(),
        }).eq("id", existingCall.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
