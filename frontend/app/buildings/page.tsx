"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Unit = { id: number; name: string; heightM: number | null };
type Building = {
  id: number;
  agencyId: number | null;
  name: string;
  address: string;
  segment: string;
  jurisdiction: string;
  ownerName: string | null;
  ownerPhone: string | null;
  onboardedOn: string;
  units: Unit[];
};
type Agency = { id: number; licenceNo: string; signatoryName: string };

const SEGMENTS = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"];
const JURISDICTIONS = ["PMC", "PCMC", "MIDC", "OTHER"];

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none";
const label = "mb-1 block text-sm font-medium text-gray-700";

function errorText(status: number, json: { message?: string }) {
  if (json?.message) return json.message;
  if (status === 400) return "Please check the details and try again.";
  if (status === 404) return "Not found.";
  if (status === 409) return "This already exists.";
  return "Something went wrong.";
}

function EditForm({
  b,
  agencies,
  onDone,
}: {
  b: Building;
  agencies: Agency[];
  onDone: () => void;
}) {
  const [f, setF] = useState({
    name: b.name,
    address: b.address,
    segment: b.segment,
    jurisdiction: b.jurisdiction,
    agencyId: b.agencyId ? String(b.agencyId) : "",
    ownerName: b.ownerName ?? "",
    ownerPhone: b.ownerPhone ?? "",
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) {
    setF((x) => ({ ...x, [k]: v }));
  }

  async function save() {
    if (!f.name.trim() || !f.address.trim()) {
      setErr("Name and address are required");
      return;
    }
    setSaving(true);
    setErr("");
    const res = await fetch(`/api/buildings/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.name.trim(),
        address: f.address.trim(),
        segment: f.segment,
        jurisdiction: f.jurisdiction,
        agencyId: f.agencyId ? Number(f.agencyId) : null,
        ownerName: f.ownerName.trim() || null,
        ownerPhone: f.ownerPhone.trim() || null,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setErr(errorText(res.status, json));
      return;
    }
    onDone();
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className={label}>Building name *</label>
          <input className={input} value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={label}>Address *</label>
          <input className={input} value={f.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div>
          <label className={label}>Segment</label>
          <select className={input} value={f.segment} onChange={(e) => set("segment", e.target.value)}>
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Jurisdiction</label>
          <select className={input} value={f.jurisdiction} onChange={(e) => set("jurisdiction", e.target.value)}>
            {JURISDICTIONS.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Owner name</label>
          <input className={input} value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
        </div>
        <div>
          <label className={label}>Owner phone</label>
          <input className={input} value={f.ownerPhone} onChange={(e) => set("ownerPhone", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Agency</label>
          <select className={input} value={f.agencyId} onChange={(e) => set("agencyId", e.target.value)}>
            <option value="">No agency</option>
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.licenceNo} · {a.signatoryName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={onDone}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function UnitForm({ buildingId, onAdded }: { buildingId: number; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setErr("Unit name is required");
      return;
    }
    setSaving(true);
    setErr("");
    const res = await fetch(`/api/buildings/${buildingId}/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        heightM: height ? Number(height) : null,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setErr(errorText(res.status, json));
      return;
    }
    setName("");
    setHeight("");
    onAdded();
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        <input
          className={`${input} flex-1 min-w-[140px]`}
          placeholder="Unit name (e.g. Wing A)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={`${input} w-32`}
          placeholder="Height (m)"
          type="number"
          min="0"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add unit"}
        </button>
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}

export default function BuildingsPage() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    segment: "RESIDENTIAL",
    jurisdiction: "PMC",
    agencyId: "",
    ownerName: "",
    ownerPhone: "",
  });

  const load = useCallback(async () => {
    try {
      const [bRes, aRes] = await Promise.all([
        fetch("/api/buildings", { cache: "no-store" }),
        fetch("/api/agencies", { cache: "no-store" }),
      ]);
      if (bRes.status === 401) {
        router.push("/login");
        return;
      }
      if (!bRes.ok) {
        setError("Could not load buildings.");
        return;
      }
      setBuildings(await bRes.json());
      if (aRes.ok) setAgencies(await aRes.json());
      setError("");
    } catch {
      setError("Could not load buildings. Please try again.");
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

    async function removeBuilding(b: Building) {
    if (
      !window.confirm(
        `Delete "${b.name}"? Its units, Form B cycles and reminders will also be deleted. This cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingId(b.id);
    const res = await fetch(`/api/buildings/${b.id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      setError("Could not delete the building. Please try again.");
      return;
    }
    setError("");
    load();
  }

  async function addBuilding() {
    if (!form.name.trim() || !form.address.trim()) {
      setFormError("Name and address are required");
      return;
    }
    setSaving(true);
    setFormError("");
    const res = await fetch("/api/buildings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        address: form.address.trim(),
        segment: form.segment,
        jurisdiction: form.jurisdiction,
        agencyId: form.agencyId ? Number(form.agencyId) : null,
        ownerName: form.ownerName.trim() || null,
        ownerPhone: form.ownerPhone.trim() || null,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setFormError(errorText(res.status, json));
      return;
    }
    setForm({
      name: "",
      address: "",
      segment: "RESIDENTIAL",
      jurisdiction: "PMC",
      agencyId: "",
      ownerName: "",
      ownerPhone: "",
    });
    setShowForm(false);
    load();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Buildings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add buildings and their units. A Form B cycle is created automatically.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {showForm ? "Cancel" : "Add building"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={label}>Building name *</label>
              <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={label}>Address *</label>
              <input className={input} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div>
              <label className={label}>Segment *</label>
              <select className={input} value={form.segment} onChange={(e) => set("segment", e.target.value)}>
                {SEGMENTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Jurisdiction *</label>
              <select className={input} value={form.jurisdiction} onChange={(e) => set("jurisdiction", e.target.value)}>
                {JURISDICTIONS.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Owner name</label>
              <input className={input} value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
            </div>
            <div>
              <label className={label}>Owner phone</label>
              <input className={input} value={form.ownerPhone} onChange={(e) => set("ownerPhone", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Agency (optional)</label>
              <select className={input} value={form.agencyId} onChange={(e) => set("agencyId", e.target.value)}>
                <option value="">No agency</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.licenceNo} · {a.signatoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}

          <button
            onClick={addBuilding}
            disabled={saving}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save building"}
          </button>
        </div>
      )}

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && buildings.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-700">
          No buildings yet. Click "Add building" to start.
        </div>
      )}

      <div className="mt-8 space-y-4">
        {buildings.map((b) => (
          <div key={b.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-lg font-medium text-gray-900">{b.name}</p>
                <p className="text-sm text-gray-500">{b.address}</p>
              </div>
               <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{b.segment}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{b.jurisdiction}</span>
                <button
                  onClick={() => setEditingId(editingId === b.id ? null : b.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-red-500 hover:text-red-600"
                >
                  {editingId === b.id ? "Close" : "Edit"}
                </button>
                <button
                  onClick={() => removeBuilding(b)}
                  disabled={deletingId === b.id}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-red-600 hover:border-red-500 disabled:opacity-50"
                >
                  {deletingId === b.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {editingId === b.id && (
              <EditForm
                b={b}
                agencies={agencies}
                onDone={() => {
                  setEditingId(null);
                  load();
                }}
              />
            )}

            {(b.ownerName || b.ownerPhone) && (
              <p className="mt-2 text-sm text-gray-600">
                Owner: {b.ownerName ?? "-"} {b.ownerPhone ? `· ${b.ownerPhone}` : ""}
              </p>
            )}

            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-sm font-medium text-gray-700">Units ({b.units.length})</p>
              {b.units.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.units.map((u) => (
                    <span key={u.id} className="rounded-lg bg-gray-50 px-3 py-1 text-sm text-gray-700">
                      {u.name}
                      {u.heightM ? ` · ${u.heightM} m` : ""}
                    </span>
                  ))}
                </div>
              )}
              <UnitForm buildingId={b.id} onAdded={load} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}