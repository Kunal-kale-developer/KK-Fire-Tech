"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { scorePassword, strengthLabel } from "@/lib/password-strength";
import AuthShell from "./AuthShell";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const pw = watch("password") ?? "";
  const score = scorePassword(pw);

  async function onSubmit(values: LoginValues) {
    setServerError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setServerError(data.message || "Login failed");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <AuthShell strength={pw ? Math.max(score, 0.08) : 0} caption={strengthLabel(score, pw.length)}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Welcome back</h1>
        <p className="sub">Log in to manage your extinguishers and service visits.</p>

        <div className={`field${errors.email ? " bad" : ""}`}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="name@company.com"
            {...register("email")}
          />
          {errors.email && <div className="msg">{errors.email.message}</div>}
        </div>

        <div className={`field${errors.password ? " bad" : ""}`}>
          <label htmlFor="password">Password</label>
          <div className="in">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password")}
            />
            <button
              type="button"
              className="eye"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <div className="msg">{errors.password.message}</div>}
        </div>

        {serverError && <p className="srv">{serverError}</p>}

        <button className="btn primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>

        <p className="foot">
          New customer? <Link href="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
