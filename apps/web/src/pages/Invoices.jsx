import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

const serviceSchema = z.object({
  label: z.string().min(1),
  amount: z.coerce.number().min(0)
});

const invoiceSchema = z.object({
  appointmentId: z.string().min(1),
  patientId: z.string().min(1),
  services: z.array(serviceSchema).min(1)
});

export function Invoices() {
  const api = useAuthorizedApi();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => (await api.get("/api/billing/invoices")).data
  });

  const { control, register, handleSubmit } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      services: [{ label: "Consult", amount: 120 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ name: "services", control });

  const mutation = useMutation({
    mutationFn: async (payload) => (await api.post("/api/billing/invoices", payload)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] })
  });

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold">Open collections</h2>
        {isLoading ? (
          <p className="text-sm">Loading invoices…</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">Invoice</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((invoice) => (
                <tr key={invoice.id} className="border-t">
                  <td className="py-2">{invoice.id}</td>
                  <td>${Number(invoice.amount || 0).toFixed(2)}</td>
                  <td>{invoice.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-md font-semibold mb-2">Create estimate</h3>
        <form className="space-y-3" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div>
            <label className="block text-xs text-slate-500">Appointment ID</label>
            <input className="mt-1 w-full border rounded px-3 py-2" {...register("appointmentId")} />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Patient ID</label>
            <input className="mt-1 w-full border rounded px-3 py-2" {...register("patientId")} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Services</p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  placeholder="Label"
                  className="flex-1 border rounded px-3 py-2"
                  {...register(`services.${index}.label`)}
                />
                <input
                  placeholder="Amount"
                  type="number"
                  className="w-28 border rounded px-3 py-2"
                  step="0.01"
                  {...register(`services.${index}.amount`)}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-xs text-brand-dark"
              onClick={() => append({ label: "", amount: 0 })}
            >
              Add service
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-brand text-white rounded-md py-2"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Calculating…" : "Create estimate"}
          </button>
        </form>
      </div>
    </div>
  );
}
