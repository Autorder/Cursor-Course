"use client";

import { useCallback, useEffect, useState } from "react";

export interface ApiKey {
  id: string;
  name: string;
  type: string;
  usage: number;
  key: string;
}

export interface UseApiKeysReturn {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  clearError: () => void;
  createKey: (name: string, type: string, key?: string) => Promise<boolean>;
  updateKey: (id: string, name: string) => Promise<boolean>;
  deleteKey: (id: string) => Promise<boolean>;
  copyToClipboard: (key: string) => Promise<void>;
}

export function useApiKeys(): UseApiKeysReturn {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/keys");
      if (!res.ok) throw new Error("Failed to fetch API keys");
      const data = await res.json();
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function createKey(name: string, type: string, key?: string): Promise<boolean> {
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, key: key || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create key");
      }
      await fetchKeys();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
      return false;
    }
  }

  async function updateKey(id: string, name: string): Promise<boolean> {
    try {
      const res = await fetch("/api/keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      if (!res.ok) throw new Error("Failed to update key");
      await fetchKeys();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update key");
      return false;
    }
  }

  async function deleteKey(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete key");
      await fetchKeys();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete key");
      return false;
    }
  }

  async function copyToClipboard(key: string): Promise<void> {
    await navigator.clipboard.writeText(key);
  }

  return {
    keys,
    loading,
    error,
    clearError: () => setError(null),
    createKey,
    updateKey,
    deleteKey,
    copyToClipboard,
  };
}
