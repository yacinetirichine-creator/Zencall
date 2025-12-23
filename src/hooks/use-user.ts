"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Profile, Organization } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        if (profileData?.organization_id) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", profileData.organization_id)
            .single();
          setOrganization(orgData);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOrganization(null);
  }, [supabase]);

  useEffect(() => {
    fetchUserData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });
    return () => subscription.unsubscribe();
  }, [fetchUserData, supabase.auth]);

  return { user, profile, organization, isLoading, refresh: fetchUserData, signOut };
}
