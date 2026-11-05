"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "OVERDUE" | "DUE_SOON" | "UPCOMING" | "SUBMITTED";
type Filter = "ALL" | Status;

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
  cycleId: number;
  submittedOn: string | null;
};

type Dashboard = {
  counts: {
    total: number;
    overdue: number;
    dueSoon: number;
    upcoming: number;
    submitted: number;
  };
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
  SUBMITTED: {
    label: "Submitted",
    badge: "bg-blue-100 text-blue-700",
    bar: "border-l-blue-500",
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
  const [busyId, setBusyId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
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
        setError("");
      }
    } catch {
      setError("Could not load the dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(item: Item, action: "submit" | "undo") {
    if (
      action === "submit" &&
      !window.confirm(`Mark Form B as submitted for ${item.buildingName}?`)
    ) {
      return;
    }
    setBusyId(item.cycleId);
    try {
      const res = await fetch(`/api/cycles/${item.cycleId}/${action}`, {
        method: "POST",
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError("Could not update the status. Please try again.");
        return;
      }
      setError("");
      await load();
    } catch {
      setError("Could not update the status. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const visible = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.buildings.filter((b) => {
      if (filter !== "ALL" && b.status !== filter) return false;
      if (!q) return true;
      return (
        b.buildingName.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.jurisdiction.toLowerCase().includes(q) ||
        b.segment.toLowerCase().includes(q)
      );
    });
  }, [data, filter, query]);

  const cards: { key: Filter; label: string; value: number; color: string }[] = data
    ? [
        { key: "ALL", label: "Total", value: data.counts.total, color: "text-gray-900" },
        { key: "OVERDUE", label: "Overdue", value: data.counts.overdue, color: "text-red-600" },
        { key: "DUE_SOON", label: "Due soon", value: data.counts.dueSoon, color: "text-amber-600" },
        { key: "UPCOMING", label: "Upcoming", value: data.counts.upcoming, color: "text-green-600" },
        { key: "SUBMITTED", label: "Submitted", value: data.counts.submitted, color: "text-blue-600" },
      ]
    : [];

  const filtering = filter !== "ALL" || query.trim() !== "";

  function clearAll() {
    setFilter("ALL");
    setQuery("");
  }

  return (
    <div className="py-2">
      <h1 className="text-3xl font-semibold text-gray-900">Compliance Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Form B status of every building for the current half-year. Pending ones first, soonest due on top.
      </p>

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {cards.map((c) => {
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className={`rounded-xl border bg-white p-5 text-left transition hover:border-red-300 ${
                    active ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  }`}
                >
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className={`mt-1 text-3xl font-semibold ${c.color}`}>{c.value}</p>
                </button>
              );
            })}
          </div>

          {data.buildings.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by building, address, PMC, RESIDENTIAL..."
                className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none"
              />
              {filtering && (
                <button
                  onClick={clearAll}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:border-red-500 hover:text-red-600"
                >
                  Clear
                </button>
              )}
              <p className="text-sm text-gray-500">
                Showing {visible.length} of {data.buildings.length} buildings
              </p>
            </div>
          )}

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
          ) : visible.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-gray-700">No buildings match your filter.</p>
              <button
                onClick={clearAll}
                className="mt-3 text-sm font-medium text-red-600 hover:underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {visible.map((b) => {
                const s = STYLE[b.status];
                const done = b.status === "SUBMITTED";
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
                    <div className="flex flex-wrap items-center gap-4 md:justify-end md:text-right">
                      <div>
                        {done ? (
                          <>
                            <p className="text-sm text-gray-900">
                              Submitted {b.submittedOn ? formatDate(b.submittedOn) : ""}
                            </p>
                            <p className="text-xs text-gray-500">Due was {formatDate(b.dueDate)}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">Due {formatDate(b.dueDate)}</p>
                            <p className="text-xs text-gray-500">{dueText(b.daysToDue)}</p>
                          </>
                        )}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.badge}`}>
                        {s.label}
                      </span>
                      <button
                        onClick={() => act(b, done ? "undo" : "submit")}
                        disabled={busyId === b.cycleId}
                        className={
                          done
                            ? "rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-red-500 hover:text-red-600 disabled:opacity-50"
                            : "rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                        }
                      >
                        {busyId === b.cycleId ? "Saving..." : done ? "Undo" : "Mark submitted"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}