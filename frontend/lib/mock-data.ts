export interface MockAppointment {
  id: string;
  patientName: string;
  providerName: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  reason: string;
}

export const mockAppointments: MockAppointment[] = [
  {
    id: "apt-001",
    patientName: "Alex Johnson",
    providerName: "Dr. Priya Patel",
    time: "May 10, 2024 · 9:00 AM",
    status: "scheduled",
    reason: "Comprehensive eye exam"
  },
  {
    id: "apt-002",
    patientName: "Jordan Smith",
    providerName: "Dr. Priya Patel",
    time: "May 10, 2024 · 10:30 AM",
    status: "scheduled",
    reason: "Contact lens fitting"
  },
  {
    id: "apt-003",
    patientName: "Taylor Lee",
    providerName: "Dr. Miguel Alvarez",
    time: "May 10, 2024 · 1:00 PM",
    status: "completed",
    reason: "Follow-up for dry eye"
  }
];

export const mockBilling = [
  {
    claimId: "clm-1021",
    patientName: "Alex Johnson",
    codes: ["99213", "G2211"],
    status: "Ready for submission"
  },
  {
    claimId: "clm-1022",
    patientName: "Jordan Smith",
    codes: ["92014"],
    status: "Pending insurance"
  }
];

export const mockCarePlans = [
  {
    id: "cp-1",
    name: "Dry Eye Management",
    patientName: "Taylor Lee",
    frequency: "Weekly touchpoints",
    tasks: [
      "Send daily reminder to use warm compress",
      "Log symptom score in Airtable",
      "Escalate to provider if score > 7"
    ]
  }
];

export const mockUser = {
  name: "Dr. Priya Patel",
  email: "priya@cordia.health",
  role: "Medical Director",
  plan: {
    name: "Team",
    status: "active"
  }
};

export const mockPortal = {
  patient: {
    name: "Alex Johnson"
  },
  appointments: [
    {
      id: "apt-001",
      provider: "Dr. Priya Patel",
      date: "May 10, 2024 at 9:00 AM",
      status: "Scheduled",
      summary: "We will review your updated vision plan and discuss glasses pickup."
    }
  ],
  glassesStatus: {
    message: "Your Oakley frames are ready for pickup. Stop by anytime this week!",
    updatedAt: "May 8, 2024"
  }
};
