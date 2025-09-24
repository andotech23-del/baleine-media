# Cordia Integrated Health MVP

An initial JavaScript-based MVP for an integrated healthcare operations platform that unifies scheduling, engagement, billing and AI-assisted documentation.

## Monorepo structure

```
apps/
  api/        # Express + Prisma API
  web/        # React front-end
packages/
  types/      # Shared Zod schemas
```

## Getting started

1. Install dependencies (requires Node.js 20+):

```bash
npm install
```

2. Copy `.env.example` to `.env` and adjust secrets.

3. Start local services with Docker Compose:

```bash
cd docker
docker compose up --build
```

The API is available at `http://localhost:4000`, the web app at `http://localhost:3000`.

### Database

Use Prisma to manage migrations:

```bash
npm --workspace api run migrate
npm --workspace api run seed
```

### Background jobs

Reminder, dunning, and webhook retry workers load automatically with the API. Inspect Redis to monitor queues.

### Webhooks

Simulate Stripe webhook delivery:

```bash
curl -X POST http://localhost:4000/api/billing/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed","data":{"object":{"metadata":{"invoiceId":"inv_seed"},"amount_total":5000,"id":"cs_test"}}}'
```

### Security notes

- JWT authentication with role-based access (Admin/Staff/Patient).
- Helmet, CORS, rate limiting, and audit logging baked in.
- HIPAA-aware logging with optional PII redaction toggle.

## Testing

Run API tests:

```bash
npm --workspace api test
```

Run web tests:

```bash
npm --workspace web test
```

## Deployment

- Production ready Dockerfiles for both API and web.
- Environment variables compatible with AWS/Azure/GCP container services.
- Redis (BullMQ) and PostgreSQL expected.

## Templates

Reusable notification templates live in `apps/api/templates` for SMS, email, Stripe invoice, and Twilio voice reminders.
