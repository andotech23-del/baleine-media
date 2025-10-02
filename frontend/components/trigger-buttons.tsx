"use client";

import { useState } from "react";

type AgentKey = "scribe" | "billing" | "vision" | "care";

interface AgentTriggerProps {
  agent: AgentKey;
  label: string;
}

export function AgentTrigger({ agent, label }: AgentTriggerProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setStatus(null);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus(`${label} dispatched`);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-500"
      disabled={loading}
    >
      {loading ? "Sending..." : label}
      {status && <span className="ml-2 text-xs text-primary-100">{status}</span>}
    </button>
  );
}
