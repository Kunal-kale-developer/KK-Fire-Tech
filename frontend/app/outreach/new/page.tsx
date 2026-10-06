"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LeadSource, Segment } from "@/types";

const SEGMENTS: Segment[] = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"];
const SOURCES: LeadSource[] = ["GOOGLE_MAPS", "REFERRAL", "EXISTING_CLIENT", "OTHER"];
const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none";

export default function NewLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    organizationName: "",
    segment: "RESIDENTIAL" as Segment,
    source: "GOOGLE_MAPS" as LeadSource,
    city: "Pune",
    area: "",
    contactName: "",
    contactRole: "Chairman",
    phone: "",
    email: "",
    nextFollowUpDate: new Date().toLocaleDateString("en-CA"),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.leads.create({
        ...form,
        city: form.city || undefined,
        area: form.area || undefined,
        contactName: form.contactName || undefined,
        contactRole: form.contactRole || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
      });
      router.push("/outreach");
    } catch {
      setError("Could not save. Check backend is running.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Add Lead</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Organization / Society</span>
          <input required className={inputClass} value={form.organizationName}
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Segment</span>
            <select className={inputClass} value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value as Segment })}>
              {SEGMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Source</span>
            <select className={inputClass} value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
              {SOURCES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">City</span>
            <input className={inputClass} value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Area</span>
            <input className={inputClass} placeholder="e.g. Kothrud" value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Contact Name</span>
            <input className={inputClass} value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Role</span>
            <input className={inputClass} value={form.contactRole}
              onChange={(e) => setForm({ ...form, contactRole: e.target.value })} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Phone</span>
            <input className={inputClass} value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input type="email" className={inputClass} value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">First Follow-up Date</span>
          <input type="date" className={inputClass} value={form.nextFollowUpDate}
            onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })} />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50">
          {submitting ? "Saving..." : "Save Lead"}
        </button>
      </form>
    </div>
  );
}