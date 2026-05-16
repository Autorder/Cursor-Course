import Link from "next/link";
import LandingCta from "@/app/components/landing-cta";
import LoginButton from "@/app/components/login-button";

const demoResponse = {
  summary:
    "Next.js is a powerful framework for building full-stack web applications using React, featuring advanced JavaScript tooling for fast builds.",
  coolFacts: [
    "Developed by Vercel with a strong focus on performance and developer experience.",
    "Supports server-side rendering, static generation, and modern React features.",
    "Encourages community contributions with good-first-issue workflows.",
  ],
  stars: 139494,
  latestVersion: "v16.2.6",
  homepage: "https://nextjs.org",
  license: "MIT",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-zinc-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-8 md:px-8">
        <header className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Dandi</span>
            </Link>
            <span className="hidden items-center gap-1.5 text-sm text-emerald-600 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Operational
            </span>
          </div>
          <div className="shrink-0">
            <LoginButton />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <span className="mb-4 inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              GitHub repository API
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              Summarize open source repositories in one request.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              Dandi turns a GitHub URL into a clean JSON response with a summary, useful facts, stars, latest version, homepage, and license.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LandingCta />
              <Link
                href="/dashboards"
                className="flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 text-white shadow-sm">
            <span className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
              Starter
            </span>
            <h2 className="mt-4 text-3xl font-bold">200 requests</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Create API keys, test repositories in the playground, and track usage from your dashboard.
            </p>
            <div className="mt-6 space-y-3 text-sm text-zinc-200">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                GitHub README summaries
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Repository metadata
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Per-key usage limits
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">API Demo</p>
              <h2 className="mt-1 text-lg font-semibold text-zinc-900">Response example</h2>
            </div>
            <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
              JSON
            </span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-sm text-zinc-200">POST /api/github-summarizer</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                200 OK
              </span>
            </div>
            <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-zinc-100">
              {JSON.stringify(demoResponse, null, 2)}
            </pre>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Structured summaries</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Get a concise summary and practical facts from each repository README.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Repository metadata</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Include stars, latest release, homepage, and license in the same API response.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">API key management</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Manage keys, reveal values, and monitor each key with usage / limit counters.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
