import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    await login(values);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-dark">Cordia Integrated Health</h1>
          <p className="text-sm text-slate-500">Sign in to orchestrate care.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs uppercase text-slate-500">Email</label>
            <input className="mt-1 w-full border rounded px-3 py-2" {...register("email")} />
          </div>
          <div>
            <label className="block text-xs uppercase text-slate-500">Password</label>
            <input type="password" className="mt-1 w-full border rounded px-3 py-2" {...register("password")} />
          </div>
          {formState.errors.email && <p className="text-xs text-red-500">Enter a valid email.</p>}
          <button type="submit" className="w-full bg-brand text-white rounded-md py-2">
            Sign in
          </button>
        </form>
        <p className="text-xs text-slate-400 text-center">Need access? Contact your practice administrator.</p>
      </div>
    </div>
  );
}
