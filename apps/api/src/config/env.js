import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "super-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/cordia",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  stripeSecret: process.env.STRIPE_SECRET || "sk_test_placeholder",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder",
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "twilio_sid",
    authToken: process.env.TWILIO_AUTH_TOKEN || "twilio_auth",
    fromNumber: process.env.TWILIO_FROM_NUMBER || "+15555550000"
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || "sendgrid_key",
    fromEmail: process.env.SENDGRID_FROM_EMAIL || "notifications@cordia.test"
  },
  logging: {
    redactPII: process.env.REDACT_PII === "true"
  }
};
