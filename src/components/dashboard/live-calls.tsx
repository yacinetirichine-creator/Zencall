"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Badge, Spinner } from "@/components/ui";
import { Phone, Clock, User } from "lucide-react";

interface LiveCall {
  id: string;
  vapi_call_id: string;
  assistant_name: string;
  caller_number: string;
  direction: "inbound" | "outbound";
  status: string;
  duration_seconds: number;
  started_at: string;
}

export function LiveCallsMonitor({ organizationId }: { organizationId: string }) {
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!organizationId) return;

    // 1. Charger les appels en cours initialement
    const fetchLiveCalls = async () => {
      const { data } = await supabase
        .from("call_logs")
        .select("*, assistant:assistants(name)")
        .eq("organization_id", organizationId)
        .eq("status", "in_progress")
        .order("started_at", { ascending: false });

      setLiveCalls(
        (data || []).map((call: any) => ({
          id: call.id,
          vapi_call_id: call.vapi_call_id,
          assistant_name: call.assistant?.name || "Assistant",
          caller_number: call.caller_number,
          direction: call.direction,
          status: call.status,
          duration_seconds: call.duration_seconds || 0,
          started_at: call.started_at,
        }))
      );
      setIsLoading(false);
    };

    fetchLiveCalls();

    // 2. S'abonner aux changements en temps réel
    const channel = supabase
      .channel("live-calls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "call_logs",
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log("Changement call_logs:", payload);

          if (payload.eventType === "INSERT" && payload.new.status === "in_progress") {
            // Nouvel appel en cours
            fetchLiveCalls();
          } else if (payload.eventType === "UPDATE") {
            // Mise à jour d'appel
            if (payload.new.status !== "in_progress") {
              // L'appel est terminé, le retirer
              setLiveCalls((prev) => prev.filter((c) => c.id !== payload.new.id));
            } else {
              // Mettre à jour les infos
              fetchLiveCalls();
            }
          } else if (payload.eventType === "DELETE") {
            setLiveCalls((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // 3. Mettre à jour les durées toutes les secondes
    const interval = setInterval(() => {
      setLiveCalls((prev) =>
        prev.map((call) => ({
          ...call,
          duration_seconds: Math.floor(
            (Date.now() - new Date(call.started_at).getTime()) / 1000
          ),
        }))
      );
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [organizationId, supabase]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </Card>
    );
  }

  if (liveCalls.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucun appel en cours</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-zencall-coral-600" />
        Appels en cours ({liveCalls.length})
      </h3>

      <div className="space-y-3">
        {liveCalls.map((call) => (
          <div
            key={call.id}
            className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-zencall-coral-50 to-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    call.direction === "inbound"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }
                >
                  {call.direction === "inbound" ? "Entrant" : "Sortant"}
                </Badge>
                <span className="text-sm font-medium text-gray-800">
                  {call.assistant_name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-600 animate-pulse">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-xs font-medium">EN DIRECT</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{call.caller_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatDuration(call.duration_seconds)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
