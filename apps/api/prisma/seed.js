import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.staff.upsert({
    where: { email: "admin@cordia.test" },
    update: {},
    create: {
      firstName: "Avery",
      lastName: "Admin",
      email: "admin@cordia.test",
      role: "ADMIN",
      password
    }
  });

  const patient = await prisma.patient.upsert({
    where: { email: "patient@cordia.test" },
    update: {},
    create: {
      firstName: "Piper",
      lastName: "Patient",
      email: "patient@cordia.test",
      phone: "+15555551234",
      dateOfBirth: new Date("1980-05-01"),
      insuranceType: "MEDICAL"
    }
  });

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      providerId: admin.id,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      status: "SCHEDULED",
      location: "Virtual",
      reason: "Follow-up"
    }
  });

  await prisma.invoice.create({
    data: {
      appointmentId: appointment.id,
      patientId: patient.id,
      amount: 120.0,
      status: "SENT",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      estimateBreakdown: [{ label: "Consult", amount: 100 }, { label: "Labs", amount: 20 }]
    }
  });

  console.log({ admin, patient, appointment });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
