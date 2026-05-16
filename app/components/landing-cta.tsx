"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingCta() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  function handleClick() {
    if (session) {
      router.push("/playground");
      return;
    }

    signIn("google", { callbackUrl: "/playground" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isLoading ? "Loading..." : "Try API Playground"}
    </button>
  );
}
