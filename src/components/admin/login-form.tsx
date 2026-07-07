"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "loading" } | { type: "error"; message: string }
  >({ type: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Fehler ${res.status}`);
      }
      // Neu laden, damit die Server-Seite den eingeloggten Zustand rendert.
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", message: (err as Error).message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface/60 p-6"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/90">Passwort</span>
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </label>
      {status.type === "error" && (
        <p className="text-sm text-red-400">{status.message}</p>
      )}
      <button
        type="submit"
        disabled={status.type === "loading" || password.length === 0}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status.type === "loading" ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
