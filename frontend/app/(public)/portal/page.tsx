import { mockPortal } from "@/lib/mock-data";

export default function PatientPortalPage() {
  const { patient, appointments, glassesStatus } = mockPortal;
  return (
    <main className="space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Welcome back, {patient.name}</h1>
        <p className="text-slate-600">Stay informed about your care journey with Cordia.</p>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li key={appt.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium">{appt.provider}</p>
                  <p className="text-xs text-slate-500">{appt.date}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-primary-600">{appt.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Summary: {appt.summary}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Glasses Pickup</h2>
        <p className="mt-2 text-sm text-slate-600">{glassesStatus.message}</p>
        <p className="mt-1 text-xs text-slate-500">Last update: {glassesStatus.updatedAt}</p>
      </section>
    </main>
  );
}
