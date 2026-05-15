"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Notification from "@/app/components/notification";

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [validating, setValidating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setValidating(true);
    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await res.json();

      if (data.valid) {
        setNotification({ message: "Valid API key! Redirecting to protected page...", type: "success" });
        setTimeout(() => {
          router.push(`/protected?key=${encodeURIComponent(apiKey.trim())}`);
        }, 1500);
      } else {
        setNotification({ message: "Invalid API key", type: "error" });
      }
    } catch {
      setNotification({ message: "Failed to validate API key", type: "error" });
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#faf8f5] font-sans">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <p className="text-xs text-zinc-400 mb-0.5">Pages / API Playground</p>
              <h1 className="text-2xl font-semibold text-zinc-900">API Playground</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8 max-w-2xl">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-1">Validate API Key</h2>
              <p className="text-sm text-zinc-500">
                Enter your API key to verify it and access the protected page.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  API Key
                </label>
                <input
                  type="text"
                  placeholder="dk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                />
              </div>
              <button
                type="submit"
                disabled={!apiKey.trim() || validating}
                className="w-full rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {validating ? "Validating..." : "Validate Key"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
