import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

export function AIScribe() {
  const api = useAuthorizedApi();
  const [transcript, setTranscript] = useState("Patient reports improving pain but lingering stiffness.");
  const [note, setNote] = useState(null);
  const [approved, setApproved] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => (await api.post("/api/scribe/transcripts", { appointmentId: "appt_seed", transcript })).data,
    onSuccess: (data) => setNote(data)
  });

  const approveMutation = useMutation({
    mutationFn: async (status) =>
      (
        await api.post(`/api/scribe/notes/${note.id}/review`, {
          reviewerId: "staff_seed",
          approved: status,
          feedback: status ? "Looks good" : "Needs revision"
        })
      ).data,
    onSuccess: (data) => {
      setNote(data);
      setApproved(true);
    }
  });

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold">Transcript ingestion</h2>
        <textarea
          className="mt-3 w-full h-64 border rounded px-3 py-2 text-sm"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
        />
        <button
          className="mt-3 px-4 py-2 bg-brand text-white rounded-md"
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isLoading}
        >
          {generateMutation.isLoading ? "Generating…" : "Generate SOAP note"}
        </button>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold">Human validation</h2>
        {note ? (
          <div className="space-y-3 text-sm">
            <p><strong>Subjective:</strong> {note.content.subjective}</p>
            <p><strong>Objective:</strong> {note.content.objective}</p>
            <p><strong>Assessment:</strong> {note.content.assessment}</p>
            <p><strong>Plan:</strong> {note.content.plan}</p>
            <div className="flex gap-3">
              <button
                className="px-3 py-2 bg-emerald-500 text-white rounded-md"
                disabled={approveMutation.isLoading || approved}
                onClick={() => approveMutation.mutate(true)}
              >
                Approve
              </button>
              <button
                className="px-3 py-2 bg-red-500 text-white rounded-md"
                disabled={approveMutation.isLoading || approved}
                onClick={() => approveMutation.mutate(false)}
              >
                Request changes
              </button>
            </div>
            {approved && <p className="text-xs text-emerald-600">Note locked after human validation.</p>}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Generate a draft to begin human review.</p>
        )}
      </div>
    </div>
  );
}
