import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const key = authHeader.slice(7);
  const supabase = await createAdminClient();
  const { data } = await supabase.from("api_keys").select("organization_id").eq("key_prefix", key.slice(0, 10)).eq("is_active", true).single();
  return data?.organization_id || null;
}

export async function GET(request: NextRequest) {
  const orgId = await validateApiKey(request);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("assistants").select("*").eq("organization_id", orgId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const orgId = await validateApiKey(request);
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("assistants").insert({ ...body, organization_id: orgId }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
