import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-semibold text-brand">
          FormB360
        </Link>
        <nav className="flex gap-6 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
          <Link href="/buildings" className="hover:text-brand">Buildings</Link>
          <Link href="/stakeholders" className="hover:text-brand">Stakeholders</Link>
        </nav>
      </div>
    </header>
  );
}
