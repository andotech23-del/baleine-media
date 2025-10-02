import { mockAppointments } from "@/lib/mock-data";
import { SummaryCard } from "@/components/summary-card";

export default function DashboardPage() {
  return (
    <main className="space-y-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-slate-600">
          Review today's appointments and trigger Cordia agents with one click.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockAppointments.map((appt) => (
          <SummaryCard key={appt.id} appointment={appt} />
        ))}
      </section>
    </main>
  );
}
