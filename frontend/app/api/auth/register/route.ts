import { proxyAuth } from "@/lib/server/auth-proxy";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  return proxyAuth("/api/auth/register", { name, email, password });
}
