"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/buildings", label: "Buildings" },
  { href: "/agencies", label: "Agencies" },
];

const HIDE_ON = ["/login", "/register"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-semibold text-brand">
          FormB360
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "font-medium text-brand"
                    : "hover:text-brand"
                }
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            disabled={loggingOut}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:border-red-500 hover:text-red-600 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </div>
    </header>
  );
}