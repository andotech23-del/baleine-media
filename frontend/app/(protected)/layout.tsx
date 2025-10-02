import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/appointments", label: "Appointments" },
  { href: "/billing", label: "Billing" },
  { href: "/care-plans", label: "Care Plans" },
  { href: "/profile", label: "Profile" }
];

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 py-8 md:flex-row">
        <aside className="w-full max-w-xs space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-primary-600">Cordia Provider</h2>
            <p className="mt-1 text-sm text-slate-500">Secure workspace for clinicians and admins.</p>
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="flex-1">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
