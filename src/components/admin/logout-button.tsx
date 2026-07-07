"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent-hover"
    >
      Abmelden
    </button>
  );
}
