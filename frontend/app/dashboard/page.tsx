import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default async function DashboardPage() {
  let items: Awaited<ReturnType<typeof api.complianceItems.expiring>> = [];
  let error: string | null = null;

  try {
    items = await api.complianceItems.expiring(30);
  } catch {
    error = "Could not reach the backend. Is it running on localhost:8080?";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Compliance Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Form B, AMC and NOC items expiring in the next 30 days, soonest first.
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="mt-6 rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-500">
          Nothing expiring in the next 30 days. Add a building and a compliance item to get started.
        </div>
      )}

      {!error && items.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-md border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Building</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.complianceItemId}>
                  <td className="px-4 py-3 font-medium">{item.buildingName}</td>
                  <td className="px-4 py-3 text-gray-600">{item.type.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-gray-600">{item.validUntil}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
