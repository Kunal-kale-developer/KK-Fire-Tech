import { proxyAuth } from "@/lib/server/auth-proxy";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  return proxyAuth("/api/auth/login", { email, password });
}
