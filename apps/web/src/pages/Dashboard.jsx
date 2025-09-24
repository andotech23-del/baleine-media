import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

export function Dashboard() {
  const api = useAuthorizedApi();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get("/api/dashboard");
      return response.data;
    }
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading metrics…</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Open balances", value: `$${data?.metrics?.openBalances?.toFixed(2) || "0.00"}` },
          { label: "Open invoices", value: data?.metrics?.openInvoiceCount || 0 },
          { label: "Failed claims", value: data?.metrics?.failedClaims || 0 },
          { label: "Upcoming visits", value: data?.metrics?.upcomingAppointments || 0 }
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-lg border p-4">
            <p className="text-xs uppercase text-slate-500">{card.label}</p>
            <p className="text-2xl font-semibold text-brand-dark">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold text-slate-800">No-show risk monitor</h2>
        <p className="text-sm text-slate-500 mb-3">Toggle RPA to auto-rescue routine errors.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Patient</th>
                <th>Start time</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {data?.noShowRisk?.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="py-2">{row.patient}</td>
                  <td>{new Date(row.startTime).toLocaleString()}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.risk === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
