import { supabase } from "@/lib/supabase";

export type ApiKeyRecord = {
  id: string;
  usage: number;
  limit: number;
};

type Fail = { ok: false; status: number; error: string };
type ValidateOk = { ok: true; apiKey: ApiKeyRecord };

export async function validateApiKey(
  rawKey: string
): Promise<ValidateOk | Fail> {
  const key = rawKey.trim();
  if (!key) {
    return { ok: false, status: 400, error: "API key is required" };
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, usage, limit")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, error: error.message };
  }

  if (!data) {
    return { ok: false, status: 401, error: "Invalid API key" };
  }

  return {
    ok: true,
    apiKey: {
      id: data.id,
      usage: data.usage,
      limit: data.limit ?? 200,
    },
  };
}

type IncrementOk = { ok: true };

export async function incrementApiKeyUsage(
  apiKey: ApiKeyRecord
): Promise<IncrementOk | Fail> {
  if (apiKey.usage >= apiKey.limit) {
    return { ok: false, status: 429, error: "Rate limit exceeded" };
  }

  const { error } = await supabase
    .from("api_keys")
    .update({ usage: apiKey.usage + 1 })
    .eq("id", apiKey.id);

  if (error) {
    return { ok: false, status: 500, error: error.message };
  }

  return { ok: true };
}
