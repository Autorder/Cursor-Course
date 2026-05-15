import { getCurrentUserId } from "@/lib/current-user";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getCurrentUserId();
  if (user instanceof NextResponse) return user;

  const { id } = await context.params;

  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUserId();
  if (user instanceof NextResponse) return user;

  const { id } = await context.params;
  const body = await request.json();
  const { name } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("api_keys")
    .update({ name: name.trim() })
    .eq("id", id)
    .eq("user_id", user.userId)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getCurrentUserId();
  if (user instanceof NextResponse) return user;

  const { id } = await context.params;

  const { data, error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
