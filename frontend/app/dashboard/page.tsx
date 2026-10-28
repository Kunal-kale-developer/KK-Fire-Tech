"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "OVERDUE" | "DUE_SOON" | "UPCOMING";

type Item = {
  buildingId: number;
  buildingName: string;
  address: string;
  segment: string;
  jurisdiction: string;
  year: number;
  half: number;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  daysToDue: number;
  status: Status;
};

type Dashboard = {
  counts: { total: number; overdue: number; dueSoon: number; upcoming: number };
  buildings: Item[];
};

const STYLE: Record<Status, { label: string; badge: string; bar: string }> = {
  OVERDUE: {
    label: "Overdue",
    badge: "bg-red-100 text-red-700",
    bar: "border-l-red-500",
  },
  DUE_SOON: {
    label: "Due soon",
    badge: "bg-amber-100 text-amber-700",
    bar: "border-l-amber-400",
  },
  UPCOMING: {
    label: "Upcoming",
    badge: "bg-green-100 text-green-700",
    bar: "border-l-green-500",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dueText(days: number) {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  return `${days} days left`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        if (!res.ok) {
          setError(json.message ?? "Something went wrong");
        } else {
          setData(json);
        }
      } catch {
        setError("Could not load the dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const cards = data
    ? [
        { label: "Total", value: data.counts.total, color: "text-gray-900" },
        { label: "Overdue", value: data.counts.overdue, color: "text-red-600" },
        { label: "Due soon", value: data.counts.dueSoon, color: "text-amber-600" },
        { label: "Upcoming", value: data.counts.upcoming, color: "text-green-600" },
      ]
    : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-900">Compliance Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Form B status of every building for the current half-year, soonest due first.
      </p>

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className={`mt-1 text-3xl font-semibold ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>

          {data.buildings.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-gray-700">No buildings yet.</p>
              <a
                href="/buildings"
                className="mt-3 inline-block text-sm font-medium text-red-600 hover:underline"
              >
                Add your first building
              </a>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {data.buildings.map((b) => {
                const s = STYLE[b.status];
                return (
                  <div
                    key={b.buildingId}
                    className={`flex flex-col gap-3 rounded-xl border border-l-4 border-gray-200 bg-white p-5 md:flex-row md:items-center md:justify-between ${s.bar}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{b.buildingName}</p>
                      <p className="text-sm text-gray-500">{b.address}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {b.segment} · {b.jurisdiction} · H{b.half} {b.year}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 md:text-right">
                      <div>
                        <p className="text-sm text-gray-900">Due {formatDate(b.dueDate)}</p>
                        <p className="text-xs text-gray-500">{dueText(b.daysToDue)}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${s.badge}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
}