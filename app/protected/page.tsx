"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Notification from "@/app/components/notification";

interface KeyInfo {
  keyName: string;
  keyType: string;
}

function ProtectedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const key = searchParams.get("key");
    if (!key) {
      router.push("/playground");
      return;
    }

    async function validateKey() {
      try {
        const res = await fetch("/api/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: key }),
        });
        const data = await res.json();

        if (data.valid) {
          setKeyInfo({ keyName: data.keyName, keyType: data.keyType });
          setNotification({ message: "Access granted with valid API key", type: "success" });
        } else {
          setNotification({ message: "Invalid API key — redirecting...", type: "error" });
          setTimeout(() => router.push("/playground"), 2000);
        }
      } catch {
        setNotification({ message: "Validation failed — redirecting...", type: "error" });
        setTimeout(() => router.push("/playground"), 2000);
      } finally {
        setLoading(false);
      }
    }

    validateKey();
  }, [searchParams, router]);

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} />

      <div>
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200">
          <div>
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <p className="text-xs text-zinc-400 mb-0.5">Pages / Protected</p>
              <h1 className="text-2xl font-semibold text-zinc-900">Protected Page</h1>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8 max-w-2xl">
          {loading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
              <p className="text-sm text-zinc-500">Validating your API key...</p>
            </div>
          ) : keyInfo ? (
            <div>
              <div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-emerald-900">Access Granted</h2>
                  <p className="text-sm text-emerald-700">Your API key is valid</p>
                </div>
              </div>
              <div>
                <div>
                  <span className="text-zinc-500">Key Name</span>
                  <span className="font-medium text-zinc-900">{keyInfo.keyName}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Key Type</span>
                  <span className="font-medium text-zinc-900">{keyInfo.keyType}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-emerald-700">
                This is a protected page that is only accessible with a valid API key. You can now use this key to access the API.
              </p>
              <button
                onClick={() => router.push("/playground")}
                className="mt-4 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Back to Playground
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm text-center">
              <p className="text-sm text-red-700">Invalid API key. Redirecting to playground...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f5]">
          <p className="text-sm text-zinc-500">Loading...</p>
        </div>
      }
    >
      <ProtectedContent />
    </Suspense>
  );
}
