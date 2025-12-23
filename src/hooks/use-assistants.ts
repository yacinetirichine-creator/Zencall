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
    const { data: newAssistant, error } = await supabase
      .from("assistants")
      .insert({ ...data, organization_id: organizationId })
      .select()
      .single();
    if (!error && newAssistant) setAssistants((prev) => [newAssistant, ...prev]);
    return newAssistant;
  };

  const updateAssistant = async (id: string, data: Partial<Assistant>) => {
    const { data: updated, error } = await supabase
      .from("assistants")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (!error && updated) setAssistants((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteAssistant = async (id: string) => {
    const { error } = await supabase.from("assistants").delete().eq("id", id);
    if (!error) setAssistants((prev) => prev.filter((a) => a.id !== id));
    return !error;
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
