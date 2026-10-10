import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8080";

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "Please check the details you entered",
  401: "Invalid email or password",
  409: "Email already registered",
};

export async function proxyAuth(path: string, payload: unknown) {
  let res: Response;
  try {
    res = await fetch(`${BACKEND}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Server is not reachable" }, { status: 503 });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message || FALLBACK_MESSAGES[res.status] || "Something went wrong" },
      { status: res.status }
    );
  }

  const { token, ...user } = data;
  const response = NextResponse.json(user);
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}