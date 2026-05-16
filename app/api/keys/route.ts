import { getCurrentUserId } from "@/lib/current-user";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function generateKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "dk_";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + result;
}

/** GET /api/keys — list keys for the logged-in user */
export async function GET() {
  const user = await getCurrentUserId();
  if (user instanceof NextResponse) return user;

  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", user.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/keys] Supabase error:", error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  return NextResponse.json(data);
}

/** POST /api/keys — create a key for the logged-in user */
export async function POST(request: NextRequest) {
  const user = await getCurrentUserId();
  if (user instanceof NextResponse) return user;

  const body = await request.json();
  const { name, type, key, limit } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const parsedLimit = limit === undefined ? 200 : Number(limit);
  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    return NextResponse.json({ error: "Limit must be a positive integer" }, { status: 400 });
  }

  const apiKey = key?.trim() || generateKey();

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      name: name.trim(),
      type: type || "dev",
      key: apiKey,
      usage: 0,
      limit: parsedLimit,
      user_id: user.userId,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/keys] Supabase error:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This API key value already exists. Leave the field blank to auto-generate." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
