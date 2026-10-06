import Link from "next/link";
import { api } from "@/lib/api";
import LeadQueue from "@/components/LeadQueue";
import { LeadStage } from "@/types";

const STAGES: LeadStage[] = ["NEW", "CONTACTED", "MEETING", "PROPOSAL", "SIGNED", "LOST"];

export default async function OutreachPage() {
  let queue: Awaited<ReturnType<typeof api.leads.queue>> = [];
  let all: Awaited<ReturnType<typeof api.leads.list>> = [];
  let error: string | null = null;

  try {
    [queue, all] = await Promise.all([api.leads.queue(), api.leads.list()]);
  } catch {
    error = "Could not reach the backend. Is it running on localhost:8080?";
  }

  const countByStage = (stage: LeadStage) => all.filter((l) => l.stage === stage).length;

  return (
    <div>
            <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Outreach</h1>
          <p className="mt-1 text-sm text-gray-500">AMC pipeline. Today's follow-ups first.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/outreach/import"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Import CSV
          </Link>
          <Link
            href="/outreach/new"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            + Add Lead
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {!error && (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
            {STAGES.map((s) => (
              <div key={s} className="rounded-md border border-gray-200 bg-white p-3">
                <div className="text-xs text-gray-500">{s}</div>
                <div className="mt-1 text-xl font-semibold">{countByStage(s)}</div>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-lg font-semibold">Today's Queue ({queue.length})</h2>
          <div className="mt-3 overflow-hidden rounded-md border border-gray-200 bg-white">
            {queue.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">Queue empty. Add leads to get started.</p>
            ) : (
              <LeadQueue leads={queue} />
            )}
          </div>
        </>
      )}
    </div>
  );
}