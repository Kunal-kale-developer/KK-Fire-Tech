import { callBackend } from "@/lib/server/backend";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  return callBackend(`/api/buildings/${params.id}/units`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}