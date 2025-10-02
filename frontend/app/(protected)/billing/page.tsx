import { mockBilling } from "@/lib/mock-data";

export default function BillingPage() {
  return (
    <main className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">Billing Automation</h1>
        <p className="text-slate-600">Track AI generated billing codes and Stripe subscription health.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {mockBilling.map((item) => (
          <div key={item.claimId} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Claim {item.claimId}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.patientName}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.codes.map((code) => (
                <span key={code} className="rounded bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
                  {code}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">Status: {item.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
