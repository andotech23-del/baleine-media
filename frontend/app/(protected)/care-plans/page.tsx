import { mockCarePlans } from "@/lib/mock-data";

export default function CarePlansPage() {
  return (
    <main className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">Care Plans</h1>
        <p className="text-slate-600">Weekly reminders powered by the Cordia care bot.</p>
      </header>
      <div className="space-y-4">
        {mockCarePlans.map((plan) => (
          <div key={plan.id} className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-slate-500">Patient: {plan.patientName}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-primary-600">{plan.frequency}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.tasks.map((task) => (
                <li key={task} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
