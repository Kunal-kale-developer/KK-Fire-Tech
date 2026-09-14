"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ComplianceType } from "@/types";

const TYPES: ComplianceType[] = ["FORM_A", "FORM_B", "FORM_N", "AMC_COMPREHENSIVE", "AMC_NON_COMPREHENSIVE", "OTHER"];

export default function NewComplianceItemPage({ params }: { params: { id: string } }) {
  const buildingId = Number(params.id);
  const router = useRouter();

  const [form, setForm] = useState({
    type: "FORM_B" as ComplianceType,
    issuingAuthority: "",
    validFrom: "",
    validUntil: "",
    renewalCycleMonths: "12",
    findings: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.complianceItems.create({
        buildingId,
        type: form.type,
        issuingAuthority: form.issuingAuthority || undefined,
        validFrom: form.validFrom,
        validUntil: form.validUntil,
        renewalCycleMonths: form.renewalCycleMonths ? Number(form.renewalCycleMonths) : undefined,
        findings: form.findings || undefined,
      });
      router.push(`/buildings/${buildingId}`);
    } catch {
      setError("Could not save. Check valid-from/until dates are filled and backend is running.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Add Compliance Item</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Type</span>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ComplianceType })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t.replaceAll("_", " ")}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Issuing Authority</span>
          <input
            type="text"
            value={form.issuingAuthority}
            onChange={(e) => setForm({ ...form, issuingAuthority: e.target.value })}
            placeholder="e.g. Pune Fire Department"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Valid From</span>
            <input
              type="date"
              required
              value={form.validFrom}
              onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Valid Until</span>
            <input
              type="date"
              required
              value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Renewal Cycle (months)</span>
          <input
            type="number"
            value={form.renewalCycleMonths}
            onChange={(e) => setForm({ ...form, renewalCycleMonths: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Findings / Deficiencies (optional)</span>
          <textarea
            value={form.findings}
            onChange={(e) => setForm({ ...form, findings: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Compliance Item"}
        </button>
      </form>
    </div>
  );
}