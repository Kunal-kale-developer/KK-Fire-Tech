import { Building, ComplianceItem, DashboardItem, Stakeholder } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }

  // DELETE endpoints return 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const api = {
  buildings: {
    list: () => request<Building[]>("/buildings"),
    get: (id: number) => request<Building>(`/buildings/${id}`),
    create: (payload: Partial<Building>) =>
      request<Building>("/buildings", { method: "POST", body: JSON.stringify(payload) }),
  },
  complianceItems: {
    list: (buildingId?: number) =>
      request<ComplianceItem[]>(buildingId ? `/compliance-items?buildingId=${buildingId}` : "/compliance-items"),
    expiring: (withinDays = 30) =>
      request<DashboardItem[]>(`/compliance-items/expiring?withinDays=${withinDays}`),
    create: (payload: Record<string, unknown>) =>
      request<ComplianceItem>("/compliance-items", { method: "POST", body: JSON.stringify(payload) }),
  },
  stakeholders: {
    list: () => request<Stakeholder[]>("/stakeholders"),
    create: (payload: Partial<Stakeholder>) =>
      request<Stakeholder>("/stakeholders", { method: "POST", body: JSON.stringify(payload) }),
  },
};
