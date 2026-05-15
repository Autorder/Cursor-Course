"use client";

import { useState } from "react";
import Notification from "@/app/components/notification";
import SignOutButton from "@/app/components/sign-out-button";
import Sidebar from "@/app/components/sidebar";
import { useApiKeys } from "@/app/hooks/useApiKeys";

function maskKey(key: string): string {
  return key.slice(0, 8) + "••••••••••••••••••••••••••••";
}

export default function DashboardPage() {
  const { keys, loading, error, clearError, createKey, updateKey, deleteKey, copyToClipboard } = useApiKeys();

  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyType, setNewKeyType] = useState("dev");
  const [editName, setEditName] = useState("");
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const usageUsed = keys.reduce((sum, k) => sum + k.usage, 0);
  const usageTotal = 1000;
  const usagePercent = Math.min((usageUsed / usageTotal) * 100, 100);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setSaving(true);
    clearError();
    const customKey = newKeyValue.trim();
    const result = await createKey(
      newKeyName.trim(),
      newKeyType,
      customKey.length > 0 ? customKey : undefined
    );
    if (result.ok) {
      setNewKeyName("");
      setNewKeyValue("");
      setNewKeyType("dev");
      setIsCreating(false);
      setNotification({ message: "API key created successfully", type: "success" });
    } else {
      setNotification({ message: result.message, type: "error" });
    }
    setSaving(false);
  }

  async function handleSaveEdit(id: string) {
    if (!editName.trim()) return;
    const success = await updateKey(id, editName.trim());
    if (success) {
      setEditingId(null);
      setEditName("");
      setNotification({ message: "API key updated successfully", type: "success" });
    } else {
      setNotification({ message: "Failed to update API key", type: "error" });
    }
  }

  async function handleDelete(id: string) {
    const success = await deleteKey(id);
    if (success) {
      setDeleteConfirmId(null);
      setNotification({ message: "API key deleted", type: "success" });
    } else {
      setNotification({ message: "Failed to delete API key", type: "error" });
    }
  }

  async function handleCopy(key: string, id: string) {
    await copyToClipboard(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setNotification({ message: "Copied to clipboard", type: "success" });
  }

  function toggleReveal(id: string) {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div>
              <p className="text-xs text-zinc-400 mb-0.5">Pages / Overview</p>
              <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Operational
            </span>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 px-8 py-8 space-y-8 max-w-4xl">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={clearError} className="text-red-400 hover:text-red-600 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          )}

          {/* Plan card */}
          <div className="rounded-2xl bg-zinc-900 text-white p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                  Current Plan
                </span>
                <h2 className="text-3xl font-bold">Researcher</h2>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                Manage Plan
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-zinc-300">API Usage</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                <span>Monthly plan</span>
                <span>{usageUsed} / {usageTotal.toLocaleString()} Credits</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* API Keys section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">API Keys</h3>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center h-7 w-7 rounded-full border border-zinc-300 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                title="Add API Key"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
              </button>
            </div>

            {/* Create form */}
            {isCreating && (
              <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-zinc-900 mb-1">Create New API Key</h4>
                <p className="text-xs text-zinc-500 mb-4">
                  Enter a name and optionally provide your own key, or leave blank to auto-generate.
                </p>
                <div className="grid grid-cols-[1fr_auto] gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. my-app-key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      autoFocus
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Type</label>
                    <select
                      value={newKeyType}
                      onChange={(e) => setNewKeyType(e.target.value)}
                      className="h-[38px] rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="dev">dev</option>
                      <option value="prod">prod</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-zinc-600 mb-1">
                    API Key <span className="text-zinc-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-generate"
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:font-sans placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    disabled={!newKeyName.trim() || saving}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Save API Key"}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewKeyName("");
                      setNewKeyValue("");
                    }}
                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Keys table */}
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Name</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Type</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Usage</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Key</th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                        Loading API keys...
                      </td>
                    </tr>
                  ) : keys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                        No API keys yet. Click + to create one.
                      </td>
                    </tr>
                  ) : (
                    keys.map((apiKey) => (
                      <tr key={apiKey.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          {editingId === apiKey.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit(apiKey.id);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                autoFocus
                                className="w-32 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-zinc-400 focus:outline-none"
                              />
                              <button onClick={() => handleSaveEdit(apiKey.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" title="Save">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1 text-zinc-400 hover:bg-zinc-100 rounded" title="Cancel">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-zinc-900">{apiKey.name}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-zinc-500">{apiKey.type}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-zinc-500">{apiKey.usage}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <code className="text-sm font-mono text-zinc-500">
                            {revealedKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => toggleReveal(apiKey.id)}
                              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                              title={revealedKeys.has(apiKey.id) ? "Hide" : "Reveal"}
                            >
                              {revealedKeys.has(apiKey.id) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(apiKey.key, apiKey.id)}
                              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                              title="Copy"
                            >
                              {copiedId === apiKey.id ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                              )}
                            </button>
                            <button
                              onClick={() => { setEditingId(apiKey.id); setEditName(apiKey.name); }}
                              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </button>
                            {deleteConfirmId === apiKey.id ? (
                              <div className="flex items-center gap-1 ml-1">
                                <button onClick={() => handleDelete(apiKey.id)} className="rounded px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700">Delete</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="rounded px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100">Cancel</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(apiKey.id)}
                                className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coupon section */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Coupon</h3>
            <p className="text-sm text-zinc-500 mb-3">Enter a coupon code to receive free API credits.</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-64 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              />
              <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-white px-8 py-4 mt-auto">
          <div className="flex items-center justify-between max-w-4xl">
            <p className="text-sm text-zinc-500">Have any questions, feedback or need support? We&apos;d love to hear from you!</p>
            <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
              Contact us
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
