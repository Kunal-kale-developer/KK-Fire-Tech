import { callBackend } from "@/lib/server/backend";

export async function POST() {
  return callBackend("/api/notifications/check-now", { method: "POST" });
}