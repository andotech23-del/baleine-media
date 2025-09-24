import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

const appointmentFormSchema = z.object({
  patientId: z.string().min(1),
  providerId: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  status: z.string().default("SCHEDULED"),
  location: z.string().min(1),
  reason: z.string().optional()
});

export function Appointments() {
  const api = useAuthorizedApi();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => (await api.get("/api/appointments")).data
  });

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(appointmentFormSchema)
  });

  const mutation = useMutation({
    mutationFn: async (formData) => (await api.post("/api/appointments", formData)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      reset();
    }
  });

  const onSubmit = (values) => mutation.mutate(values);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Schedule</h2>
        {isLoading ? (
          <p className="text-sm">Loading schedule…</p>
        ) : (
          <ul className="space-y-3">
            {data?.map((appt) => (
              <li key={appt.id} className="border rounded p-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-brand-dark">
                    {appt.patient?.firstName} {appt.patient?.lastName}
                  </span>
                  <span>{new Date(appt.startTime).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500">Status: {appt.status}</p>
                <p className="text-xs text-slate-500">Location: {appt.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-md font-semibold mb-2">Add appointment</h3>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs text-slate-500">Patient ID</label>
            <input className="mt-1 w-full border rounded px-3 py-2" {...register("patientId")}/>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Provider ID</label>
            <input className="mt-1 w-full border rounded px-3 py-2" {...register("providerId")}/>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Start time</label>
            <input type="datetime-local" className="mt-1 w-full border rounded px-3 py-2" {...register("startTime")}/>
          </div>
          <div>
            <label className="block text-xs text-slate-500">End time</label>
            <input type="datetime-local" className="mt-1 w-full border rounded px-3 py-2" {...register("endTime")}/>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Location</label>
            <input className="mt-1 w-full border rounded px-3 py-2" {...register("location")}/>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Reason</label>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows="3" {...register("reason")}></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-brand text-white rounded-md py-2"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Saving…" : "Schedule"}
          </button>
          {formState.errors.patientId && (
            <p className="text-xs text-red-500">Patient ID is required.</p>
          )}
        </form>
      </div>
    </div>
  );
}
