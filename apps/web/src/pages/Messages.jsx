import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

export function Messages() {
  const api = useAuthorizedApi();
  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => (await api.get("/api/messages/inbox")).data
  });

  if (isLoading) return <p>Loading messages…</p>;

  return (
    <div className="bg-white border rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-semibold">Unified inbox</h2>
      <p className="text-sm text-slate-500">Track SMS and email conversations in one place.</p>
      <div className="divide-y">
        {data?.map((message) => (
          <div key={message.id} className="py-3 flex flex-col sm:flex-row sm:justify-between text-sm">
            <div>
              <p className="font-medium">
                {message.direction === "OUTBOUND" ? "Sent" : "Received"} via {message.channel}
              </p>
              <p className="text-slate-600">{message.body}</p>
            </div>
            <div className="text-xs text-slate-400 mt-1 sm:mt-0">
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
