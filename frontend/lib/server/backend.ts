import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function callBackend(path: string, init: RequestInit = {}) {
  const token = cookies().get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Please login" }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Server is not reachable" }, { status: 503 });
  }

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}