import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/patients", label: "Patients" },
  { to: "/appointments", label: "Appointments" },
  { to: "/messages", label: "Messages" },
  { to: "/invoices", label: "Billing" },
  { to: "/scribe", label: "AI Scribe" },
  { to: "/settings", label: "Settings" }
];

export function Layout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-brand-dark">Cordia Integrated Health</h1>
            <p className="text-sm text-slate-500">Care orchestration for modern practices</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">{user?.firstName}</p>
            <button
              onClick={logout}
              className="text-xs text-brand-dark underline"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="bg-brand text-white">
          <ul className="flex overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm font-medium ${
                      isActive ? "bg-brand-dark" : "hover:bg-brand-dark"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Cordia Integrated Health. HIPAA-aware logging enabled.
      </footer>
    </div>
  );
}
