import { mockUser } from "@/lib/mock-data";

export default function ProfilePage() {
  const user = mockUser;
  return (
    <main className="space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">Profile & Billing</h1>
        <p className="text-slate-600">Manage subscription plans, team access, and connected integrations.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-slate-500">Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Role</dt>
              <dd>{user.role}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Stripe Subscription</h2>
          <p className="mt-2 text-sm text-slate-600">
            Current plan: <span className="font-medium">{user.plan.name}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Status: {user.plan.status}</p>
          <div className="mt-4 flex gap-3">
            <button className="rounded-md bg-primary-600 px-4 py-2 text-sm text-white">Upgrade</button>
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm">Open Portal</button>
          </div>
        </section>
      </div>
    </main>
  );
}
