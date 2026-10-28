import { callBackend } from "@/lib/server/backend";

export async function GET() {
  return callBackend("/api/agencies");
}

export async function POST(req: Request) {
  const body = await req.json();
  return callBackend("/api/agencies", { method: "POST", body: JSON.stringify(body) });
}