"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Assistant } from "@/types";

export function useAssistants(organizationId?: string) {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchAssistants = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("assistants")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    setAssistants(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  const createAssistant = async (data: Partial<Assistant>) => {
    try {
      // 1. Créer l'assistant dans VAPI d'abord
      const vapiResponse = await fetch("/api/vapi/assistants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          language: data.language,
          system_prompt: data.system_prompt,
          first_message: data.first_message,
        }),
      });

      if (!vapiResponse.ok) {
        throw new Error("Erreur création assistant VAPI");
      }

      const { vapi_assistant_id } = await vapiResponse.json();

      // 2. Créer dans Supabase avec l'ID VAPI
      const { data: newAssistant, error } = await supabase
        .from("assistants")
        .insert({ 
          ...data, 
          organization_id: organizationId,
          vapi_assistant_id,
        })
        .select()
        .single();

      if (!error && newAssistant) {
        setAssistants((prev) => [newAssistant, ...prev]);
      }
      return newAssistant;
    } catch (error) {
      console.error("Erreur création assistant:", error);
      return null;
    }
  };

  const updateAssistant = async (id: string, data: Partial<Assistant>) => {
    try {
      // 1. Récupérer l'assistant actuel pour avoir son vapi_assistant_id
      const { data: currentAssistant } = await supabase
        .from("assistants")
        .select("vapi_assistant_id")
        .eq("id", id)
        .single();

      // 2. Mettre à jour dans VAPI si l'assistant a un ID VAPI
      if (currentAssistant?.vapi_assistant_id) {
        await fetch("/api/vapi/assistants", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vapi_assistant_id: currentAssistant.vapi_assistant_id,
            ...data,
          }),
        });
      }

      // 3. Mettre à jour dans Supabase
      const { data: updated, error } = await supabase
        .from("assistants")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (!error && updated) {
        setAssistants((prev) => prev.map((a) => (a.id === id ? updated : a)));
      }
      return updated;
    } catch (error) {
      console.error("Erreur mise à jour assistant:", error);
      return null;
    }
  };

  const deleteAssistant = async (id: string) => {
    try {
      // 1. Récupérer l'assistant pour avoir son vapi_assistant_id
      const { data: assistant } = await supabase
        .from("assistants")
        .select("vapi_assistant_id")
        .eq("id", id)
        .single();

      // 2. Supprimer dans VAPI si l'assistant a un ID VAPI
      if (assistant?.vapi_assistant_id) {
        await fetch(`/api/vapi/assistants?id=${assistant.vapi_assistant_id}`, {
          method: "DELETE",
        });
      }

      // 3. Supprimer dans Supabase
      const { error } = await supabase.from("assistants").delete().eq("id", id);
      
      if (!error) {
        setAssistants((prev) => prev.filter((a) => a.id !== id));
      }
      return !error;
    } catch (error) {
      console.error("Erreur suppression assistant:", error);
      return false;
    }
  };

  useEffect(() => { fetchAssistants(); }, [fetchAssistants]);

  return { assistants, isLoading, refresh: fetchAssistants, createAssistant, updateAssistant, deleteAssistant };
}

export function useAssistant(id: string) {
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    supabase
      .from("assistants")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setAssistant(data);
        setIsLoading(false);
      });
  }, [id, supabase]);

  return { assistant, isLoading };
}
