"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewBuildingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    buildingType: "",
    societyChairmanName: "",
    societyChairmanContact: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const building = await api.buildings.create(form);
      router.push(`/buildings/${building.id}`);
    } catch {
      setError("Could not save the building. Check the backend is running.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Add Building</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
        <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        <Field label="Building Type" value={form.buildingType} onChange={(v) => setForm({ ...form, buildingType: v })} placeholder="Residential / Commercial" />
        <Field label="Chairman Name" value={form.societyChairmanName} onChange={(v) => setForm({ ...form, societyChairmanName: v })} />
        <Field label="Chairman Contact" value={form.societyChairmanContact} onChange={(v) => setForm({ ...form, societyChairmanContact: v })} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Building"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </label>
  );
}