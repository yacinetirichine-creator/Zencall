"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useCampaigns(organizationId?: string) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchCampaigns = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    
    const { data } = await supabase
      .from("campaigns")
      .select("*, assistant:assistants(name, vapi_assistant_id)")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    
    setCampaigns(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  const startCampaign = async (campaignId: string) => {
    try {
      const response = await fetch("/api/campaigns/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });

      if (response.ok) {
        // Mettre à jour le statut localement
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, status: "running" } : c))
        );
      }
      
      return response.ok;
    } catch (error) {
      console.error("Erreur lancement campagne:", error);
      return false;
    }
  };

  const pauseCampaign = async (campaignId: string) => {
    const { error } = await supabase
      .from("campaigns")
      .update({ status: "paused" })
      .eq("id", campaignId);

    if (!error) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: "paused" } : c))
      );
    }
    
    return !error;
  };

  const updateCampaignStats = async (campaignId: string) => {
    try {
      await fetch("/api/campaigns/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });
      
      // Rafraîchir les données
      await fetchCampaigns();
    } catch (error) {
      console.error("Erreur mise à jour stats:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    isLoading,
    refresh: fetchCampaigns,
    startCampaign,
    pauseCampaign,
    updateCampaignStats,
  };
}
