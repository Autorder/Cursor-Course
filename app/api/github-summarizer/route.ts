import { summarizeReadme } from "@/lib/chain";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

async function getReadmeContent(githubUrl: string): Promise<string> {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const [, owner, repo] = match;
  const repoName = repo.replace(/\.git$/, "");

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.raw",
        "User-Agent": "dandi-app",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch README");
  }

  return res.text();
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "API key is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key", apiKey.trim())
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Invalid API key" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { githubUrl } = body;

  if (!githubUrl?.trim()) {
    return NextResponse.json(
      { error: "githubUrl is required" },
      { status: 400 }
    );
  }

  try {
    const readmeContent = await getReadmeContent(githubUrl.trim());
    const { summary, coolFacts } = await summarizeReadme(readmeContent);

    return NextResponse.json({ summary, coolFacts });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to summarize repository";
    const status = message.includes("README") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
