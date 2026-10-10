"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { scorePassword, strengthLabel } from "@/lib/password-strength";
import AuthShell from "./AuthShell";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const pw = watch("password") ?? "";
  const score = scorePassword(pw);

  async function onSubmit({ name, email, password }: RegisterValues) {
    setServerError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setServerError(data.message || "Registration failed");
      return;
    }
    router.replace("/login");
  }

  return (
    <AuthShell strength={pw ? Math.max(score, 0.08) : 0} caption={strengthLabel(score, pw.length)}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Create your account</h1>
        <p className="sub">Register to track your extinguishers, refills and service visits.</p>

        <div className={`field${errors.name ? " bad" : ""}`}>
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" autoComplete="name" placeholder="Your name" {...register("name")} />
          {errors.name && <div className="msg">{errors.name.message}</div>}
        </div>

        <div className={`field${errors.email ? " bad" : ""}`}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="name@company.com" {...register("email")} />
          {errors.email && <div className="msg">{errors.email.message}</div>}
        </div>

        <div className={`field${errors.password ? " bad" : ""}`}>
          <label htmlFor="password">Create password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password")}
          />
          <div className="hint">Watch the gauge: stronger password, higher pressure.</div>
          {errors.password && <div className="msg">{errors.password.message}</div>}
        </div>

        <div className={`field${errors.confirmPassword ? " bad" : ""}`}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <div className="msg">{errors.confirmPassword.message}</div>}
        </div>

        {serverError && <p className="srv">{serverError}</p>}

        <button className="btn primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>

        <p className="foot">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}