import { api } from "@/lib/api";

export default async function StakeholdersPage() {
  let stakeholders: Awaited<ReturnType<typeof api.stakeholders.list>> = [];
  let error: string | null = null;

  try {
    stakeholders = await api.stakeholders.list();
  } catch {
    error = "Could not reach the backend. Is it running on localhost:8080?";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Stakeholders</h1>
      <p className="mt-1 text-sm text-gray-500">Architects, designers, vendors and society chairmen.</p>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && (
        <div className="mt-6 overflow-hidden rounded-md border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stakeholders.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.role}</td>
                  <td className="px-4 py-3 text-gray-600">{s.organization ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email ?? s.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
