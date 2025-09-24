import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthorizedApi } from "../hooks/useAuth.js";

export function Patients() {
  const api = useAuthorizedApi();
  const { data, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await api.get("/api/patients");
      return response.data;
    }
  });

  if (isLoading) return <p className="text-sm">Loading patients…</p>;

  return (
    <div className="bg-white border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-lg font-semibold">Patients</h2>
          <p className="text-sm text-slate-500">Engage patients with proactive messaging.</p>
        </div>
        <Link to="/intake" className="px-3 py-2 bg-brand text-white rounded-md text-sm">
          Digital intake
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Insurance</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="py-2 px-4">
                  <Link to={`/patients/${patient.id}`} className="text-brand-dark underline">
                    {patient.firstName} {patient.lastName}
                  </Link>
                </td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.insuranceType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
