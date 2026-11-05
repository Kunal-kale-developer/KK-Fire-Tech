import { callBackend } from "@/lib/server/backend";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return callBackend(`/api/cycles/${params.id}/submit`, { method: "POST" });
}