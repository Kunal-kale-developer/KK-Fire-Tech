export function scorePassword(v: string) {
  let s = 0;
  if (v.length >= 6) s += 0.25;
  if (v.length >= 10) s += 0.25;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s += 0.2;
  if (/\d/.test(v)) s += 0.15;
  if (/[^A-Za-z0-9]/.test(v)) s += 0.15;
  return Math.min(s, 1);
}

export function strengthLabel(s: number, len: number) {
  if (!len) return "Enter your password";
  if (s < 0.4) return "Pressure low: weak password";
  if (s < 0.8) return "Pressure building: okay";
  return "Fully charged: strong password";
}