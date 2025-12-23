import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
