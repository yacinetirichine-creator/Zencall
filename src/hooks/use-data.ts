"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { CallLog, Contact, Appointment, Campaign } from "@/types";

export function useCalls(options?: { organizationId?: string; limit?: number }) {
  const { organizationId, limit = 50 } = options || {};
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchCalls = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("call_logs")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(limit);
    setCalls(data || []);
    setIsLoading(false);
  }, [organizationId, limit, supabase]);

  useEffect(() => { fetchCalls(); }, [fetchCalls]);
  return { calls, isLoading, refresh: fetchCalls };
}

export function useContacts(organizationId?: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchContacts = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    setContacts(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  const createContact = async (data: Partial<Contact>) => {
    const { data: newContact } = await supabase
      .from("contacts")
      .insert({ ...data, organization_id: organizationId })
      .select()
      .single();
    if (newContact) setContacts((prev) => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    const { data: updated } = await supabase.from("contacts").update(data).eq("id", id).select().single();
    if (updated) setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteContact = async (id: string) => {
    await supabase.from("contacts").delete().eq("id", id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => { fetchContacts(); }, [fetchContacts]);
  return { contacts, isLoading, refresh: fetchContacts, createContact, updateContact, deleteContact };
}

export function useAppointments(organizationId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchAppointments = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("organization_id", organizationId)
      .order("start_time", { ascending: true });
    setAppointments(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  const createAppointment = async (data: Partial<Appointment>) => {
    const { data: newAppt } = await supabase
      .from("appointments")
      .insert({ ...data, organization_id: organizationId })
      .select()
      .single();
    if (newAppt) setAppointments((prev) => [...prev, newAppt].sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()));
    return newAppt;
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    const { data: updated } = await supabase.from("appointments").update(data).eq("id", id).select().single();
    if (updated) setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
  return { appointments, isLoading, refresh: fetchAppointments, createAppointment, updateAppointment };
}

export function useCampaigns(organizationId?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchCampaigns = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    setCampaigns(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  const createCampaign = async (data: Partial<Campaign>) => {
    const { data: newCampaign } = await supabase
      .from("campaigns")
      .insert({ 
        ...data, 
        organization_id: organizationId,
        stats: { total_contacts: 0, calls_made: 0, calls_answered: 0, success_rate: 0 }
      })
      .select()
      .single();
    if (newCampaign) setCampaigns((prev) => [newCampaign, ...prev]);
    return newCampaign;
  };

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);
  return { campaigns, isLoading, refresh: fetchCampaigns, createCampaign };
}

export function useStats(organizationId?: string) {
  const [stats, setStats] = useState<{
    totalCalls: number;
    totalMinutes: number;
    successRate: number;
    appointmentsToday: number;
    callsByDay: { date: string; count: number }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!organizationId) return;
    setIsLoading(true);
    
    const fetchStats = async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const { data: calls } = await supabase
        .from("call_logs")
        .select("*")
        .eq("organization_id", organizationId)
        .gte("created_at", startDate.toISOString());

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: appointmentsToday } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .gte("start_time", today.toISOString())
        .lt("start_time", new Date(today.getTime() + 86400000).toISOString());

      const totalCalls = calls?.length || 0;
      const totalMinutes = Math.round((calls?.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) || 0) / 60);
      const completed = calls?.filter((c) => c.status === "completed").length || 0;
      const successRate = totalCalls > 0 ? Math.round((completed / totalCalls) * 100) : 0;

      const callsByDay: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const count = calls?.filter((c) => c.created_at.startsWith(dateStr)).length || 0;
        callsByDay.push({ date: dateStr, count });
      }

      setStats({ totalCalls, totalMinutes, successRate, appointmentsToday: appointmentsToday || 0, callsByDay });
      setIsLoading(false);
    };

    fetchStats();
  }, [organizationId, supabase]);

  return { stats, isLoading };
}
