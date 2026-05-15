import { getSession } from "@/lib/auth-session";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type CurrentUserResult = { userId: string } | NextResponse;

/** Resolves the logged-in user's id from NextAuth session → users table. */
export async function getCurrentUserId(): Promise<CurrentUserResult> {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (user) {
    return { userId: user.id };
  }

  // User signed in before `users` table existed — create on first API use
  const { data: created, error: insertError } = await supabase
    .from("users")
    .insert({
      email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    })
    .select("id")
    .single();

  if (created) {
    return { userId: created.id };
  }

  if (insertError?.code === "23505") {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existing) return { userId: existing.id };
  }

  return NextResponse.json(
    { error: insertError?.message ?? "Could not resolve user" },
    { status: 500 }
  );
}
