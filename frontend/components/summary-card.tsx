import { AgentTrigger } from "./trigger-buttons";
import type { MockAppointment } from "@/lib/mock-data";

export function SummaryCard({ appointment }: { appointment: MockAppointment }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
        <p className="text-sm text-slate-500">{appointment.time}</p>
      </header>
      <p className="text-sm text-slate-600">{appointment.reason}</p>
      <div className="mt-auto flex flex-wrap gap-3">
        <AgentTrigger agent="scribe" label="Run Scribe" />
        <AgentTrigger agent="billing" label="Send to Billing" />
        <AgentTrigger agent="care" label="Update Care" />
      </div>
    </article>
  );
}
