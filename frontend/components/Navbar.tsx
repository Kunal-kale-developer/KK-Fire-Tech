"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/buildings", label: "Buildings" },
  { href: "/agencies", label: "Agencies" },
];

const HIDE_ON = ["/login", "/register"];

type Notice = {
  id: number;
  buildingId: number;
  stage: string;
  message: string;
  dueDate: string;
  seen: boolean;
  createdAt: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<Notice[]>([]);
  const box = useRef<HTMLDivElement>(null);

  const hidden = HIDE_ON.some((p) => pathname.startsWith(p));

  const loadNotices = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setUnread(json.unread ?? 0);
      setItems(json.items ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (hidden) return;
    loadNotices();
    const t = setInterval(loadNotices, 60000);
    return () => clearInterval(t);
  }, [hidden, pathname, loadNotices]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (hidden) return null;

  async function toggleBell() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      await fetch("/api/notifications/seen-all", { method: "POST" });
      setUnread(0);
    }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
                className={active ? "font-medium text-brand" : "hover:text-brand"}
              >
                {l.label}
              </Link>
            );
          })}

          <div className="relative" ref={box}>
            <button
              onClick={toggleBell}
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-medium text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-900">
                  Reminders
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {items.length === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-gray-500">
                      No reminders yet.
                    </p>
                  )}
                  {items.map((n) => (
                    <Link
                      key={n.id}
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block border-b border-gray-50 px-4 py-3 hover:bg-gray-50"
                    >
                      <p className={`text-sm ${n.stage === "OVERDUE" ? "text-red-600" : "text-gray-900"}`}>
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">Due {formatDate(n.dueDate)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

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