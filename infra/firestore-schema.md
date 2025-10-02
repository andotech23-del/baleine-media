# Cordia Firestore Schema

## Collections

### appointments
- `patient_id` *(string)* — Firebase Auth UID or external identifier
- `provider_id` *(string)* — Provider UID
- `scheduled_for` *(timestamp)* — Appointment start
- `status` *(string)* — scheduled | completed | cancelled
- `notes` *(string, optional)*

### billing
- `job_id` *(string)* — Response id from billing bot
- `billing_codes` *(array<string>)*
- `insurance_details` *(map)*
- `created_at` *(timestamp)*

### vision_notifications
- `job_id` *(string)*
- `message_preview` *(string)*
- `notification_channel` *(string)*
- `created_at` *(timestamp)*

### care_plans
- `job_id` *(string)* — Response id from care bot
- `scheduled_tasks` *(array<map>)*
- `created_at` *(timestamp)*
- `updated_at` *(timestamp)*

### logs
- `event` *(string)*
- `payload` *(map)*
- `created_at` *(timestamp)*
