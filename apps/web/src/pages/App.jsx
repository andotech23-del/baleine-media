import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Layout } from "../components/Layout.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { Patients } from "./Patients.jsx";
import { PatientDetail } from "./PatientDetail.jsx";
import { Appointments } from "./Appointments.jsx";
import { Messages } from "./Messages.jsx";
import { Invoices } from "./Invoices.jsx";
import { AIScribe } from "./AIScribe.jsx";
import { Settings } from "./Settings.jsx";
import { Login } from "./Login.jsx";
import { Intake } from "./Intake.jsx";

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/intake" element={<Intake />} />
      <Route
        path="/"
        element={token ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="scribe" element={<AIScribe />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
