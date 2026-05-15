import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { apiKey } = body;

  if (!apiKey?.trim()) {
    return NextResponse.json(
      { valid: false, error: "API key is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, type")
    .eq("key", apiKey.trim())
    .single();

  if (error || !data) {
    return NextResponse.json(
      { valid: false, error: "Invalid API key" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    valid: true,
    keyName: data.name,
    keyType: data.type,
  });
}
