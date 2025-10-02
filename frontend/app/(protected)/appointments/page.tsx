import { mockAppointments } from "@/lib/mock-data";

export default function AppointmentsPage() {
  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-slate-600">Synced from Firestore and external EPM systems.</p>
      </div>
      <table className="min-w-full divide-y divide-slate-200 overflow-hidden rounded-lg border bg-white">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Patient</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Provider</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Time</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {mockAppointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm">{appt.patientName}</td>
              <td className="px-4 py-3 text-sm">{appt.providerName}</td>
              <td className="px-4 py-3 text-sm">{appt.time}</td>
              <td className="px-4 py-3 text-sm capitalize">{appt.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
