import Link from "next/link";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default async function BuildingDetailPage({ params }: { params: { id: string } }) {
  const buildingId = Number(params.id);
  const [building, items] = await Promise.all([
    api.buildings.get(buildingId),
    api.complianceItems.list(buildingId),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{building.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{building.address}</p>
          {building.societyChairmanName && (
            <p className="mt-1 text-xs text-gray-400">
              Chairman: {building.societyChairmanName} {building.societyChairmanContact && `· ${building.societyChairmanContact}`}
            </p>
          )}
        </div>
        <Link
          href={`/buildings/${buildingId}/compliance-items/new`}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Add Compliance Item
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-gray-200 bg-white">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No compliance items yet for this building.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Issuing Authority</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium">{item.type.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-gray-600">{item.issuingAuthority ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.validUntil}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}