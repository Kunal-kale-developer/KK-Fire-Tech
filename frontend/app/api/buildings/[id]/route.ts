import { callBackend } from "@/lib/server/backend";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  return callBackend(`/api/buildings/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return callBackend(`/api/buildings/${params.id}`, { method: "DELETE" });
}