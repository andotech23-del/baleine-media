import { z } from "zod";

export const roleEnum = z.enum(["ADMIN", "STAFF", "PATIENT"]);

export const patientSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  dateOfBirth: z.string(),
  insuranceType: z.enum(["MEDICAL", "ROUTINE"]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const staffSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: roleEnum,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const appointmentSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "CHECKED_IN", "NO_SHOW", "CANCELLED"]),
  location: z.string().min(1),
  reason: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const messageSchema = z.object({
  id: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  channel: z.enum(["SMS", "EMAIL"]),
  direction: z.enum(["OUTBOUND", "INBOUND"]),
  body: z.string().min(1),
  status: z.enum(["QUEUED", "SENT", "DELIVERED", "FAILED", "RECEIVED"]),
  createdAt: z.string().datetime().optional()
});

export const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  appointmentId: z.string().uuid(),
  patientId: z.string().uuid(),
  amount: z.number().nonnegative(),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]),
  dueDate: z.string().datetime(),
  estimateBreakdown: z.array(z.object({
    label: z.string(),
    amount: z.number().nonnegative()
  })),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const paymentSchema = z.object({
  id: z.string().uuid().optional(),
  invoiceId: z.string().uuid(),
  amount: z.number().nonnegative(),
  status: z.enum(["INITIATED", "SUCCEEDED", "FAILED", "REFUNDED"]),
  provider: z.enum(["STRIPE"]),
  externalReference: z.string().optional(),
  createdAt: z.string().datetime().optional()
});

export const soapSectionSchema = z.object({
  subjective: z.string().min(1),
  objective: z.string().min(1),
  assessment: z.string().min(1),
  plan: z.string().min(1)
});

export const transcriptSchema = z.object({
  appointmentId: z.string().uuid(),
  transcript: z.string().min(1)
});

export const soapNoteSchema = z.object({
  id: z.string().uuid().optional(),
  appointmentId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: soapSectionSchema,
  status: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED"]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const auditLogSchema = z.object({
  id: z.string().uuid().optional(),
  actorId: z.string().uuid().nullable(),
  actorRole: roleEnum.nullable(),
  event: z.string(),
  entity: z.string(),
  entityId: z.string().uuid().nullable(),
  meta: z.record(z.any()).optional(),
  redacted: z.boolean().optional(),
  createdAt: z.string().datetime().optional()
});

export const webhookEventSchema = z.object({
  id: z.string().uuid().optional(),
  provider: z.enum(["STRIPE", "TWILIO", "SENDGRID"]),
  eventType: z.string(),
  payload: z.record(z.any()),
  status: z.enum(["RECEIVED", "PROCESSING", "SUCCESS", "FAILED"]),
  retryCount: z.number().nonnegative().default(0),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const authCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const soapGenerationRequestSchema = transcriptSchema.extend({
  reviewerId: z.string().uuid().optional()
});

export const reminderSettingsSchema = z.object({
  practiceId: z.string().uuid().optional(),
  cadenceDays: z.array(z.number().positive()),
  smsTemplate: z.string(),
  emailTemplate: z.string()
});

export const apiSchemas = {
  patientSchema,
  staffSchema,
  appointmentSchema,
  messageSchema,
  invoiceSchema,
  paymentSchema,
  soapNoteSchema,
  authCredentialsSchema,
  reminderSettingsSchema
};

export default apiSchemas;
