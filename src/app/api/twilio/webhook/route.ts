import { NextRequest, NextResponse } from "next/server";
import { getTwilioClient } from "@/lib/twilio/client";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * Vérifie la signature Twilio pour sécuriser le webhook
 */
function verifyTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string | null
): boolean {
  if (!signature) return false;

  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) return false;

  // Construire la signature attendue
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);

  const expectedSignature = crypto
    .createHmac("sha1", authToken)
    .update(data)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Webhook Twilio pour recevoir les statuts de SMS
 * POST /api/twilio/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Vérifier la signature Twilio
    const signature = request.headers.get("x-twilio-signature");
    const url = request.url;

    if (!verifyTwilioSignature(url, params, signature)) {
      console.error("Invalid Twilio signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = params;

    // Mettre à jour le statut du SMS dans la base de données
    const supabase = await createAdminClient();
    
    const statusMap: Record<string, string> = {
      queued: "pending",
      sending: "pending",
      sent: "sent",
      delivered: "delivered",
      failed: "failed",
      undelivered: "failed",
    };

    const mappedStatus = statusMap[MessageStatus] || MessageStatus;

    await supabase
      .from("notifications")
      .update({
        status: mappedStatus,
        error: ErrorCode ? `${ErrorCode}: ${ErrorMessage}` : null,
        sent_at: ["sent", "delivered"].includes(mappedStatus)
          ? new Date().toISOString()
          : undefined,
        delivered_at:
          mappedStatus === "delivered" ? new Date().toISOString() : undefined,
      })
      .eq("data->>twilio_message_sid", MessageSid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur webhook Twilio:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
