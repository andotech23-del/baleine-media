# Cordia Healthcare Automation Platform

Cordia is a SaaS automation suite for modern optometry and multispecialty clinics. It orchestrates AI agents, workflow
automation, and a multi-tenant portal so teams can capture rich visit summaries, sync billing, and keep patients informed in
real-time.

## Repository layout

```
agents/           # Cloud Run ready AI microservices (scribe, billing, vision, care)
backend/          # FastAPI gateway connecting Firebase Auth, Firestore, Stripe, Twilio, Slack
frontend/         # Next.js 14 web experience for providers, admins, and patients
infra/            # Terraform, Firestore security rules, Firebase Auth configuration
n8n/flows/        # Exportable n8n workflow for appointment + care automations
.github/workflows # CI/CD pipelines
```

## Features

- **Agentic AI services**: Four FastAPI-powered agents (`cordia-*`) expose `/run` and `/status` for summarisation,
  billing code extraction, vision notifications, and care plan orchestration.
- **Unified API**: Backend FastAPI service proxies agent calls, persists data in Firestore, and validates requests via
  Firebase Authentication.
- **Next.js Frontend**: Provider dashboard, appointment views, billing console, care plan manager, and patient portal with
  mock data ready for customization.
- **Stripe monetization**: Predefined Basic, Team, and Enterprise plan scaffolding with hooks for invoices and customer
  portal embedding.
- **Workflow automation**: n8n flow covering reminders, agent triggers, Slack/Gmail/Twilio notifications, and weekly care
  nudges.
- **GCP native**: Cloud Run deployment scripts, Firestore indexes/rules, and GitHub Actions pipeline.

## Getting started

1. **Clone and install dependencies**
   ```bash
   npm install --prefix frontend
   python -m venv .venv && source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

2. **Configure environment**
   - Create a Firebase project, enable Firestore + Authentication, and download service account credentials.
   - Set the following environment variables for local development:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
     export FIREBASE_PROJECT_ID=<project-id>
     export STRIPE_API_KEY=<test-key>
     export TWILIO_ACCOUNT_SID=<sid>
     export TWILIO_AUTH_TOKEN=<token>
     export SLACK_BOT_TOKEN=<token>
     export GMAIL_APP_PASSWORD=<app-password>
     ```

3. **Run services locally**
   ```bash
   # Backend
   uvicorn app.main:app --reload --app-dir backend/app --port 8080

   # Agents (example)
   uvicorn main:app --app-dir agents/cordia-scribe-bot --port 8010
   ```
   Next.js frontend can be started with `npm run dev --prefix frontend`.

4. **Automation testing**
   - Load `n8n/flows/cordia_flow.json` into an n8n instance and update Webhook URLs to point at your deployed backend/agent
     endpoints.

## Deployment

- **Cloud Run**: Use the Terraform module in `infra/terraform` to provision Cloud Run services and Firestore. Update
  `terraform.tfvars` with container image references produced by Cloud Build or `deploy.sh`.
- **CI/CD**: GitHub Actions workflow (`.github/workflows/deploy.yml`) authenticates with GCP and runs `deploy.sh` for each
  microservice on pushes to `main`.
- **Manual deploy**: `./deploy.sh <service>` builds, pushes, and deploys a selected service (`backend`, `scribe`, `billing`,
  `vision`, `care`, `frontend`).

## Firestore security & schema

- Security rules: `infra/firestore.rules`
- Composite indexes: `infra/firestore.indexes.json`
- Document schema reference: `infra/firestore-schema.md`

## Testing

```bash
pytest backend/tests
```

Frontend testing can be added via Playwright or Cypress; placeholders are ready for integration.

## Roadmap for customization

- Replace mock agent logic with Vertex AI or PaLM calls and persist results back to Firestore.
- Wire Stripe webhooks to synchronize subscription state and embed the customer portal within `/profile`.
- Connect Airtable + Notion webhooks via n8n to sync intake forms and care team notes.
- Extend EPM integration (`backend/app/services/epm.py`) with real credentials for Kareo or DrChrono.
