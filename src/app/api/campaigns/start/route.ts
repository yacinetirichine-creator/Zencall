import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { CampaignService } from "@/lib/vapi/campaigns";

/**
 * Lance une campagne d'appels sortants
 * POST /api/campaigns/start
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

    // Lancer la campagne en arrière-plan
    CampaignService.startCampaign(campaign_id)
      .then(() => console.log(`Campagne ${campaign_id} terminée`))
      .catch((error) => console.error(`Erreur campagne ${campaign_id}:`, error));

    return NextResponse.json({
      success: true,
      message: "Campagne lancée",
    });
  } catch (error: any) {
    console.error("Erreur lancement campagne:", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}
