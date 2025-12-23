"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Subscription, Invoice, UsageMetric } from "@/types";

export function useSubscription(organizationId?: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchSubscription = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("organization_id", organizationId)
      .single();
    setSubscription(data);
    setIsLoading(false);
  }, [organizationId, supabase]);

  useEffect(() => { fetchSubscription(); }, [fetchSubscription]);
  return { subscription, isLoading, refresh: fetchSubscription };
}

export function useInvoices(organizationId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchInvoices = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });
    setInvoices(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);
  return { invoices, isLoading, refresh: fetchInvoices };
}

export function useUsageMetrics(organizationId?: string) {
  const [metrics, setMetrics] = useState<UsageMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchMetrics = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("usage_metrics")
      .select("*")
      .eq("organization_id", organizationId)
      .order("period_start", { ascending: false })
      .limit(12);
    setMetrics(data || []);
    setIsLoading(false);
  }, [organizationId, supabase]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);
  return { metrics, isLoading, refresh: fetchMetrics };
}
