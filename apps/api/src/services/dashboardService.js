import prisma from "../repositories/prismaClient.js";

export const getRcmDashboard = async () => {
  const [openInvoices, claimRejections, appointments] = await Promise.all([
    prisma.invoice.findMany({ where: { status: { in: ["SENT", "OVERDUE"] } } }),
    prisma.webhookEvent.findMany({ where: { provider: "STRIPE", status: "FAILED" }, take: 10 }),
    prisma.appointment.findMany({ include: { patient: true, messages: true }, take: 20 })
  ]);

  const agingBuckets = openInvoices.reduce(
    (acc, invoice) => {
      const ageDays = Math.floor((Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      if (ageDays <= 30) acc.current.push(invoice);
      else if (ageDays <= 60) acc.thirty.push(invoice);
      else acc.sixtyPlus.push(invoice);
      return acc;
    },
    { current: [], thirty: [], sixtyPlus: [] }
  );

  const noShowRisk = appointments.filter((appt) => appt.status === "SCHEDULED").map((appt) => ({
    id: appt.id,
    patient: `${appt.patient.firstName} ${appt.patient.lastName}`,
    startTime: appt.startTime,
    risk: appt.messages?.length < 1 ? "HIGH" : "MEDIUM"
  }));

  return {
    metrics: {
      openBalances: openInvoices.reduce((sum, invoice) => sum + invoice.amount, 0),
      openInvoiceCount: openInvoices.length,
      failedClaims: claimRejections.length,
      upcomingAppointments: appointments.length
    },
    agingBuckets,
    claimRejections,
    noShowRisk
  };
};

export const simulateRpa = async () => {
  const invoices = await prisma.invoice.updateMany({
    where: { status: "OVERDUE" },
    data: { status: "SENT" }
  });
  return { processed: invoices.count };
};

export default { getRcmDashboard, simulateRpa };
