import { incrementApiKeyUsage, validateApiKey } from "@/lib/api-key-utils";
import { summarizeReadme } from "@/lib/chain";
import { getRepoInfo } from "@/lib/github-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKeyHeader = request.headers.get("x-api-key");

  const validated = await validateApiKey(apiKeyHeader ?? "");
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: validated.status }
    );
  }

  const rate = await incrementApiKeyUsage(validated.apiKey);
  if (!rate.ok) {
    return NextResponse.json({ error: rate.error }, { status: rate.status });
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
    const repoInfo = await getRepoInfo(githubUrl.trim());
    const { summary, coolFacts } = await summarizeReadme(repoInfo.readmeContent);

    return NextResponse.json({
      summary,
      coolFacts,
      stars: repoInfo.stars,
      latestVersion: repoInfo.latestVersion,
      homepage: repoInfo.homepage,
      license: repoInfo.license,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to summarize repository";
    const status = message.includes("README") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
