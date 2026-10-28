import { callBackend } from "@/lib/server/backend";

export async function GET() {
  return callBackend("/api/dashboard");
}