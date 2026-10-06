"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { api } from "@/lib/api";
import { Lead, LeadSource, Segment } from "@/types";

const SEGMENTS: Segment[] = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"];
const SOURCES: LeadSource[] = ["GOOGLE_MAPS", "REFERRAL", "EXISTING_CLIENT", "OTHER"];
const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none";

type ParsedRow = { lead: Partial<Lead>; error?: string };

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD, local date
}

export default function ImportLeadsPage() {
  const router = useRouter();
  const [defaultSegment, setDefaultSegment] = useState<Segment>("RESIDENTIAL");
  const [defaultSource, setDefaultSource] = useState<LeadSource>("GOOGLE_MAPS");
  const [perDay, setPerDay] = useState("25");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (result) => {
        const parsed = result.data.map((r): ParsedRow => {
          const get = (k: string) => (r[k] ?? "").trim();
          const segment = (get("segment").toUpperCase() || defaultSegment) as Segment;
          const source = (get("source").toUpperCase() || defaultSource) as LeadSource;

          let rowError: string | undefined;
          if (!get("organizationName")) rowError = "organizationName missing";
          else if (!SEGMENTS.includes(segment)) rowError = `bad segment: ${segment}`;
          else if (!SOURCES.includes(source)) rowError = `bad source: ${source}`;

          return {
            error: rowError,
            lead: {
              organizationName: get("organizationName"),
              segment,
              source,
              city: get("city") || undefined,
              area: get("area") || undefined,
              contactName: get("contactName") || undefined,
              contactRole: get("contactRole") || undefined,
              phone: get("phone") || undefined,
              email: get("email") || undefined,
            },
          };
        });
        setRows(parsed);
      },
    });
  }

  const valid = rows.filter((r) => !r.error);
  const invalid = rows.filter((r) => r.error);

  async function handleImport() {
    setImporting(true);
    setError(null);
    const n = Math.max(1, Number(perDay) || 25);
    // spread follow-ups: first n leads today, next n tomorrow, ...
    const payload = valid.map((r, i) => ({
      ...r.lead,
      nextFollowUpDate: dateOffset(Math.floor(i / n)),
    }));
    try {
      await api.leads.bulkCreate(payload);
      router.push("/outreach");
    } catch {
      setError("Import failed. Check backend is running.");
      setImporting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Import Leads (CSV)</h1>
      <p className="mt-1 text-sm text-gray-500">
        Columns: organizationName (required), contactName, contactRole, phone, email, city, area, segment, source
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Default Segment</span>
          <select className={inputClass} value={defaultSegment}
            onChange={(e) => setDefaultSegment(e.target.value as Segment)}>
            {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Default Source</span>
          <select className={inputClass} value={defaultSource}
            onChange={(e) => setDefaultSource(e.target.value as LeadSource)}>
            {SOURCES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Leads per day</span>
          <input type="number" min={1} className={inputClass} value={perDay}
            onChange={(e) => setPerDay(e.target.value)} />
        </label>
      </div>

      <input type="file" accept=".csv" onChange={handleFile} className="mt-6 block text-sm" />

      {rows.length > 0 && (
        <div className="mt-6">
          <p className="text-sm">
            <span className="font-medium text-green-700">{valid.length} valid</span>
            {invalid.length > 0 && (
              <span className="ml-3 font-medium text-red-600">{invalid.length} skipped</span>
            )}
          </p>

          <div className="mt-3 max-h-80 overflow-auto rounded-md border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Contact</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.slice(0, 50).map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{r.lead.organizationName || "—"}</td>
                    <td className="px-3 py-2 text-gray-600">{r.lead.contactName ?? "—"}</td>
                    <td className="px-3 py-2 text-gray-600">{r.lead.phone ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">
                      {r.error ? <span className="text-red-600">{r.error}</span> : <span className="text-green-700">OK</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 50 && <p className="mt-1 text-xs text-gray-400">Showing first 50 of {rows.length}</p>}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleImport}
            disabled={importing || valid.length === 0}
            className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {importing ? "Importing..." : `Import ${valid.length} leads`}
          </button>
        </div>
      )}
    </div>
  );
}