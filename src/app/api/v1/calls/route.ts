import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  
  const key = authHeader.slice(7);
  const supabase = await createAdminClient();
  
  const { data } = await supabase
    .from("api_keys")
    .select("organization_id")
    .eq("key_prefix", key.slice(0, 10))
    .eq("is_active", true)
    .single();
  
  return data?.organization_id || null;
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
