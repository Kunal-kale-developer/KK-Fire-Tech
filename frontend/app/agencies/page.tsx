"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Agency = {
  id: number;
  licenceNo: string;
  validFrom: string;
  validTo: string;
  signatoryName: string;
};

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-gray-700";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function validity(validTo: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(validTo);
  const days = Math.round((end.getTime() - today.getTime()) / 86400000);
  if (days < 0) return { text: "Expired", cls: "bg-red-100 text-red-700" };
  if (days <= 30) return { text: `Expires in ${days} days`, cls: "bg-amber-100 text-amber-700" };
  return { text: "Valid", cls: "bg-green-100 text-green-700" };
}

function saveErrorText(status: number, message?: string) {
  if (status === 409)
    return "An agency with this licence number already exists. Please use a different licence number.";
  if (status === 400)
    return message && message !== "Bad Request"
      ? message
      : "Please check the details you entered and try again.";
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 503) return "Server is not reachable right now. Please try again in a moment.";
  return "Unable to save the agency right now. Please try again.";
}

export default function AgenciesPage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    licenceNo: "",
    validFrom: "",
    validTo: "",
    signatoryName: "",
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/agencies", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError("Could not load agencies.");
        return;
      }
      setAgencies(await res.json());
      setError("");
    } catch {
      setError("Could not load agencies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function addAgency() {
    if (!form.licenceNo.trim() || !form.validFrom || !form.validTo || !form.signatoryName.trim()) {
      setFormError("All fields are required");
      return;
    }
    if (form.validTo < form.validFrom) {
      setFormError("Valid to must be after valid from");
      return;
    }
    setSaving(true);
    setFormError("");
    const res = await fetch("/api/agencies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licenceNo: form.licenceNo.trim(),
        validFrom: form.validFrom,
        validTo: form.validTo,
        signatoryName: form.signatoryName.trim(),
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
      if (!res.ok) {
      setFormError(saveErrorText(res.status, json?.message));
      return;
    }
    setForm({ licenceNo: "", validFrom: "", validTo: "", signatoryName: "" });
    setShowForm(false);
    load();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Agencies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Licensed fire agencies that sign the Form B for your buildings.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {showForm ? "Cancel" : "Add agency"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={label}>Licence number *</label>
              <input className={input} value={form.licenceNo} onChange={(e) => set("licenceNo", e.target.value)} />
            </div>
            <div>
              <label className={label}>Signatory name *</label>
              <input className={input} value={form.signatoryName} onChange={(e) => set("signatoryName", e.target.value)} />
            </div>
            <div>
              <label className={label}>Valid from *</label>
              <input type="date" className={input} value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} />
            </div>
            <div>
              <label className={label}>Valid to *</label>
              <input type="date" className={input} value={form.validTo} onChange={(e) => set("validTo", e.target.value)} />
            </div>
          </div>

          {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}

          <button
            onClick={addAgency}
            disabled={saving}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save agency"}
          </button>
        </div>
      )}

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && agencies.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-700">
          No agencies yet. Click "Add agency" to start.
        </div>
      )}

      <div className="mt-8 space-y-3">
        {agencies.map((a) => {
          const v = validity(a.validTo);
          return (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{a.licenceNo}</p>
                <p className="text-sm text-gray-500">Signatory: {a.signatoryName}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-700">
                  {formatDate(a.validFrom)} to {formatDate(a.validTo)}
                </p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${v.cls}`}>{v.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}