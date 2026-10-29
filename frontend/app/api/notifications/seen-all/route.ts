import { callBackend } from "@/lib/server/backend";

export async function POST() {
  return callBackend("/api/notifications/seen-all", { method: "POST" });
}