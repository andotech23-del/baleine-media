import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const intakeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  reason: z.string().min(1),
  preferredDate: z.string().min(1)
});

export function Intake() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(intakeSchema) });

  const onSubmit = () => setSubmitted(true);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-brand-dark">Cordia Digital Front Door</h1>
          <p className="text-sm text-slate-500">
            Book visits, complete intake, and pay secure estimates—designed with accessibility in mind.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <article className="space-y-3">
            <h2 className="text-lg font-semibold">Schedule your visit</h2>
            <p className="text-sm text-slate-600">
              Choose a preferred date and share the reason for your visit. Our care team will confirm within one
              business day.
            </p>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500">First name</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" {...register("firstName")} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">Last name</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" {...register("lastName")} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500">Email</label>
                <input className="mt-1 w-full border rounded px-3 py-2" {...register("email")} />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Mobile phone</label>
                <input className="mt-1 w-full border rounded px-3 py-2" {...register("phone")} />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Preferred date</label>
                <input type="date" className="mt-1 w-full border rounded px-3 py-2" {...register("preferredDate")} />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Reason for visit</label>
                <textarea className="mt-1 w-full border rounded px-3 py-2" rows="3" {...register("reason")}></textarea>
              </div>
              <button type="submit" className="w-full bg-brand text-white rounded-md py-2">
                Submit request
              </button>
              {submitted && <p className="text-xs text-emerald-600">Request received! Check your email for next steps.</p>}
              {formState.errors.email && <p className="text-xs text-red-500">Provide a valid email to receive updates.</p>}
            </form>
          </article>
          <article className="space-y-3">
            <h2 className="text-lg font-semibold">Complete eCheck-in</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Upload insurance cards securely.</li>
              <li>• Digitally sign consent and financial policy.</li>
              <li>• Share accessibility needs—we support large text and screen reader navigation.</li>
            </ul>
            <button className="px-3 py-2 bg-slate-200 rounded-md text-sm">Start intake forms</button>

            <h2 className="text-lg font-semibold pt-4">Pay estimate</h2>
            <p className="text-sm text-slate-600">
              Review your personalized estimate and submit payment through our Stripe-powered portal.
            </p>
            <button className="px-3 py-2 bg-brand text-white rounded-md text-sm">Pay now</button>
          </article>
        </section>
      </div>
    </div>
  );
}
