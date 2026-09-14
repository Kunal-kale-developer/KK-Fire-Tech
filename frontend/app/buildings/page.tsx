import Link from "next/link";
import { api } from "@/lib/api";

export default async function BuildingsPage() {
  let buildings: Awaited<ReturnType<typeof api.buildings.list>> = [];
  let error: string | null = null;

  try {
    buildings = await api.buildings.list();
  } catch {
    error = "Could not reach the backend. Is it running on localhost:8080?";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Buildings</h1>
         <Link href="/buildings/new" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
    + Add Building
  </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && buildings.length === 0 && (
        <div className="mt-6 rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No buildings yet. Add one via POST /api/buildings to see it here.
        </div>
      )}

      {!error && buildings.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {buildings.map((b) => (
            <li key={b.id} className="rounded-md border border-gray-200 bg-white p-4">
              <Link href={`/buildings/${b.id}`} className="font-medium text-gray-900 hover:text-brand">
                {b.name}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{b.address}</p>
              {b.societyChairmanName && (
                <p className="mt-1 text-xs text-gray-400">Chairman: {b.societyChairmanName}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
