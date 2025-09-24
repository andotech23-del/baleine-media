import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

export function Settings() {
  const api = useAuthorizedApi();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/api/notifications/settings")).data
  });

  const { register, handleSubmit, reset } = useForm({ defaultValues: data });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (values) => (await api.put("/api/notifications/settings", values)).data,
    onSuccess: (values) => reset(values)
  });

  return (
    <div className="max-w-2xl bg-white border rounded-lg p-4">
      <h2 className="text-lg font-semibold">Automation settings</h2>
      <p className="text-sm text-slate-500 mb-4">Configure reminder cadences and templates across SMS and email.</p>
      <form className="space-y-3" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div>
          <label className="block text-xs text-slate-500">Cadence days (comma separated)</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            defaultValue={data?.cadenceDays?.join(",")}
            {...register("cadenceDays", {
              setValueAs: (value) =>
                value
                  .split(",")
                  .map((v) => Number(v.trim()))
                  .filter(Boolean)
            })}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">SMS template</label>
          <textarea className="mt-1 w-full border rounded px-3 py-2" rows="3" {...register("smsTemplate")}></textarea>
        </div>
        <div>
          <label className="block text-xs text-slate-500">Email template</label>
          <textarea className="mt-1 w-full border rounded px-3 py-2" rows="5" {...register("emailTemplate")}></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-brand text-white rounded-md"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
