"use client";

import { useEffect, useState } from "react";

export default function AuthShell({
  strength = 0,
  caption = "Enter your password",
  children,
}: {
  strength?: number;
  caption?: string;
  children: React.ReactNode;
}) {
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = setTimeout(() => setSweep(1), 350);
    const b = setTimeout(() => setSweep(0), 1300);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const deg = -85 + Math.max(sweep, strength) * 170;

  return (
    <main className="main">
      <section className="side">
        <div className="brand">
          <span aria-hidden="true">🧯</span>KK Fire Tech
        </div>
        <div>
          <div className="gauge" aria-hidden="true">
            <svg viewBox="0 0 240 140">
              <path d="M30 120A90 90 0 0 1 75 42.06" fill="none" stroke="#FF5A5F" strokeWidth="16" />
              <path d="M75 42.06A90 90 0 0 1 165 42.06" fill="none" stroke="#F2A900" strokeWidth="16" />
              <path d="M165 42.06A90 90 0 0 1 210 120" fill="none" stroke="#3FD17F" strokeWidth="16" />
              <g className="needle" style={{ transform: `rotate(${deg}deg)` }}>
                <line x1="120" y1="120" x2="120" y2="44" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              </g>
              <circle cx="120" cy="120" r="9" fill="#fff" />
            </svg>
          </div>
          <div className="cap" aria-live="polite">{caption}</div>
        </div>
        <div>
          <h2>Every cylinder checked. Every date on record.</h2>
          <p>See refill dates, service reports and safety certificates for all your extinguishers in one place.</p>
        </div>
      </section>

      <section className="wrap">{children}</section>
    </main>
  );
}