import { NextRequest, NextResponse } from "next/server";
import { getTwilioClient } from "@/lib/twilio/client";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Envoie un SMS via Twilio
 * POST /api/twilio/send-sms
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, type, organization_id, user_id } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "to et message requis" },
        { status: 400 }
      );
    }

    const twilioClient = getTwilioClient();
    const result = await twilioClient.sendSMS(to, message);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Enregistrer la notification dans Supabase
    const supabase = await createAdminClient();
    await supabase.from("notifications").insert({
      organization_id,
      user_id,
      type: "sms",
      title: type || "SMS",
      message,
      recipient_phone: to,
      status: "sent",
      data: { twilio_message_sid: result.sid },
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message_sid: result.sid,
    });
  } catch (error: any) {
    console.error("Erreur envoi SMS:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}
