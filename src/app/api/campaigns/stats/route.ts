import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { CampaignService } from "@/lib/vapi/campaigns";

/**
 * Met à jour les statistiques d'une campagne
 * POST /api/campaigns/stats
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaign_id } = body;

    if (!campaign_id) {
      return NextResponse.json(
        { error: "campaign_id requis" },
        { status: 400 }
      );
    }

    await CampaignService.updateCampaignStats(campaign_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur mise à jour stats:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}
