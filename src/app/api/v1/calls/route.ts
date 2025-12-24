import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import bcrypt from "bcrypt";

/**
 * Valide une API key avec vérification du hash complet
 * Retourne l'organization_id si valide, null sinon
 */
async function validateApiKey(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const apiKey = authHeader.slice(7);
  const prefix = apiKey.slice(0, 10);

  const supabase = await createAdminClient();

  // 1. Récupérer toutes les clés actives avec ce préfixe
  const { data: keys } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key_prefix", prefix)
    .eq("is_active", true);

  if (!keys || keys.length === 0) {
    return null;
  }

  // 2. Vérifier le hash complet pour chaque clé potentielle
  for (const key of keys) {
    try {
      const isValid = await bcrypt.compare(apiKey, key.key_hash);
      
      if (isValid) {
        // 3. Mettre à jour les statistiques d'utilisation
        await supabase
          .from("api_keys")
          .update({
            last_used_at: new Date().toISOString(),
            usage_count: (key.usage_count || 0) + 1,
            last_used_ip: request.ip || request.headers.get("x-forwarded-for") || "unknown",
          })
          .eq("id", key.id);

        return key.organization_id;
      }
    } catch (error) {
      console.error("Error comparing API key hash:", error);
      continue;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const orgId = await validateApiKey(request);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  
  const { data, error } = await supabase
    .from("call_logs")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
