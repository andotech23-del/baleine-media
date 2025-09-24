import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

export function PatientDetail() {
  const { id } = useParams();
  const api = useAuthorizedApi();
  const { data, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const response = await api.get(`/api/patients/${id}`);
      return response.data;
    }
  });

  if (isLoading) return <p>Loading patient record…</p>;

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold">{data.firstName} {data.lastName}</h2>
        <p className="text-sm text-slate-500">{data.email} · {data.phone}</p>
        <p className="text-sm text-slate-500">Insurance: {data.insuranceType}</p>
      </section>

      <section className="bg-white border rounded-lg p-4">
        <h3 className="text-md font-semibold mb-2">Communication history</h3>
        <ul className="space-y-2 text-sm">
          {data.messages?.map((message) => (
            <li key={message.id} className="border rounded p-2 flex justify-between">
              <div>
                <p className="font-medium">{message.direction === "OUTBOUND" ? "Sent" : "Received"} via {message.channel}</p>
                <p className="text-slate-600">{message.body}</p>
              </div>
              <span className="text-xs text-slate-400">{new Date(message.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-md font-semibold mb-2">Invoices</h3>
          <ul className="space-y-2 text-sm">
            {data.invoices?.map((invoice) => (
              <li key={invoice.id} className="flex justify-between border rounded p-2">
                <span>#{invoice.id.slice(0, 8)}</span>
                <span>${invoice.amount}</span>
                <span className="uppercase text-xs">{invoice.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-md font-semibold mb-2">Appointments</h3>
          <ul className="space-y-2 text-sm">
            {data.appointments?.map((appt) => (
              <li key={appt.id} className="border rounded p-2">
                <p className="font-medium">{new Date(appt.startTime).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Status: {appt.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
