import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-12 px-6 py-24">
      <section>
        <span className="rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-600">
          Cordia Healthcare OS
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-tight">
          Automate appointments, billing, and longitudinal care in one workspace.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Cordia orchestrates AI agents, Firestore, and workflow automation so your team can focus on
          high-touch patient experiences instead of manual busywork.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/portal"
            className="rounded-md bg-primary-600 px-6 py-3 text-white shadow hover:bg-primary-500"
          >
            Patient Portal
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-primary-600 px-6 py-3 text-primary-600 hover:bg-primary-50"
          >
            Provider Login
          </Link>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {["AI visit summaries", "Automated billing", "Glasses ready alerts", "Care plan nudges"].map(
          (item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{item}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Prewired with mock data so you can tailor workflows to your practice when ready.
              </p>
            </div>
          )
        )}
      </section>
    </main>
  );
}
