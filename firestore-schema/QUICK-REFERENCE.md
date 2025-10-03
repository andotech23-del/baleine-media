# Firestore Schema Quick Reference

This document provides a quick overview of all collections and their relationships for the Cordia Healthcare Platform.

## Collection Overview

```
cordia-healthcare/
├── patients/              # Patient demographic and medical records
├── providers/             # Healthcare provider profiles
├── appointments/          # Appointment scheduling
├── notes/                 # Clinical documentation
├── payments/              # Billing and payments
└── messages/              # Secure messaging
```

## Entity Relationships

```
┌─────────┐         ┌─────────────┐         ┌──────────┐
│Patients │────────▶│Appointments │◀────────│Providers │
└─────────┘         └─────────────┘         └──────────┘
     │                     │                      │
     │                     │                      │
     ▼                     ▼                      ▼
┌─────────┐         ┌─────────────┐         ┌──────────┐
│ Notes   │◀────────│  Payments   │         │Messages  │
└─────────┘         └─────────────┘         └──────────┘
```

## Collections Summary

### 1. Patients Collection
**Purpose**: Store patient demographic and medical information

**Key Fields**:
- `userId` (string, indexed) - Firebase Auth UID
- `email` (string, unique, indexed)
- `profile` (object) - Demographics
- `medicalInfo` (object) - Medical history
- `insurance` (object) - Insurance details
- `status` (string, indexed) - active/inactive/archived

**Common Queries**:
```javascript
// Get active patients
db.collection('patients').where('status', '==', 'active')

// Find patient by email
db.collection('patients').where('email', '==', email)

// Recent patients
db.collection('patients')
  .orderBy('lastVisit', 'desc')
  .limit(10)
```

---

### 2. Providers Collection
**Purpose**: Healthcare provider profiles and credentials

**Key Fields**:
- `userId` (string, indexed)
- `email` (string, unique, indexed)
- `profile` (object) - Professional info
- `credentials` (object) - Licenses and certifications
- `specialization` (array, indexed)
- `acceptingNewPatients` (boolean, indexed)
- `rating` (object) - Reviews

**Common Queries**:
```javascript
// Find providers by specialization
db.collection('providers')
  .where('specialization', 'array-contains', 'Primary Care')
  .where('acceptingNewPatients', '==', true)

// Top-rated providers
db.collection('providers')
  .orderBy('rating.average', 'desc')
  .limit(10)
```

---

### 3. Appointments Collection
**Purpose**: Manage patient appointments and scheduling

**Key Fields**:
- `patientId` (string, indexed) - Reference to patient
- `providerId` (string, indexed) - Reference to provider
- `appointmentDate` (timestamp, indexed)
- `type` (string) - in-person/telehealth/phone
- `status` (string, indexed) - scheduled/confirmed/completed/cancelled
- `location` (object)

**Common Queries**:
```javascript
// Patient's upcoming appointments
db.collection('appointments')
  .where('patientId', '==', patientId)
  .where('appointmentDate', '>', new Date())
  .orderBy('appointmentDate', 'asc')

// Provider's schedule for a day
db.collection('appointments')
  .where('providerId', '==', providerId)
  .where('appointmentDate', '>=', startOfDay)
  .where('appointmentDate', '<=', endOfDay)
  .orderBy('appointmentDate', 'asc')
```

---

### 4. Notes Collection
**Purpose**: Clinical notes and documentation

**Key Fields**:
- `patientId` (string, indexed)
- `providerId` (string, indexed)
- `appointmentId` (string, indexed)
- `noteType` (string, indexed) - progress-note/consultation/etc.
- `encounterDate` (timestamp, indexed)
- `content` (object) - SOAP format
- `diagnoses` (array) - ICD-10 codes
- `status` (string, indexed) - draft/finalized/amended

**Common Queries**:
```javascript
// Patient's medical history
db.collection('notes')
  .where('patientId', '==', patientId)
  .orderBy('encounterDate', 'desc')

// Recent notes by provider
db.collection('notes')
  .where('providerId', '==', providerId)
  .where('status', '==', 'draft')
  .orderBy('createdAt', 'desc')
```

---

### 5. Payments Collection
**Purpose**: Billing, invoicing, and payment tracking

**Key Fields**:
- `patientId` (string, indexed)
- `appointmentId` (string, indexed)
- `invoiceNumber` (string, unique, indexed)
- `amount` (object) - Total, insurance, patient responsibility
- `status` (string, indexed) - pending/paid/overdue
- `dueDate` (timestamp, indexed)
- `transactions` (array) - Payment history

**Common Queries**:
```javascript
// Patient's outstanding bills
db.collection('payments')
  .where('patientId', '==', patientId)
  .where('status', 'in', ['pending', 'overdue'])

// Overdue payments
db.collection('payments')
  .where('status', '==', 'overdue')
  .where('dueDate', '<', new Date())
  .orderBy('dueDate', 'asc')
```

---

### 6. Messages Collection
**Purpose**: Secure messaging between patients and providers

**Key Fields**:
- `threadId` (string, indexed) - Groups conversation
- `senderId` (string, indexed)
- `recipientId` (string, indexed)
- `senderType` (string) - patient/provider
- `subject` (string)
- `body` (string)
- `status` (object) - sent/delivered/read
- `messageType` (string, indexed)

**Common Queries**:
```javascript
// Unread messages for user
db.collection('messages')
  .where('recipientId', '==', userId)
  .where('status.read', '==', false)
  .orderBy('createdAt', 'desc')

// Thread messages
db.collection('messages')
  .where('threadId', '==', threadId)
  .orderBy('createdAt', 'asc')
```

---

## Data Flow Examples

### Example 1: Booking an Appointment

```javascript
1. Patient searches for providers
   GET /providers?specialization=Primary Care&acceptingNewPatients=true

2. Patient selects time slot
   POST /appointments
   {
     patientId: "patient-123",
     providerId: "provider-456",
     appointmentDate: "2024-04-15T10:00:00Z",
     type: "telehealth",
     status: "scheduled"
   }

3. System sends confirmation
   POST /messages
   {
     senderId: "system",
     recipientId: "patient-123",
     subject: "Appointment Confirmation",
     messageType: "appointment"
   }
```

### Example 2: Clinical Visit Flow

```javascript
1. Patient checks in
   UPDATE /appointments/{id}
   { checkinTime: serverTimestamp() }

2. Provider creates note during visit
   POST /notes
   {
     patientId: "patient-123",
     providerId: "provider-456",
     appointmentId: "appt-789",
     noteType: "progress-note",
     content: { ... },
     status: "draft"
   }

3. Provider finalizes note
   UPDATE /notes/{id}
   { status: "finalized", signature: { ... } }

4. Generate payment
   POST /payments
   {
     patientId: "patient-123",
     appointmentId: "appt-789",
     amount: { ... },
     status: "pending"
   }

5. Complete appointment
   UPDATE /appointments/{id}
   { 
     status: "completed",
     checkoutTime: serverTimestamp()
   }
```

### Example 3: Patient-Provider Messaging

```javascript
1. Patient sends message
   POST /messages
   {
     threadId: "new-thread-id",
     senderId: "patient-123",
     recipientId: "provider-456",
     subject: "Question about medication",
     body: "...",
     status: { sent: true, delivered: false, read: false }
   }

2. Provider receives notification
   [Real-time listener triggers]

3. Provider reads and replies
   UPDATE /messages/{id}
   { status: { read: true, readAt: serverTimestamp() } }
   
   POST /messages
   {
     threadId: "same-thread-id",
     senderId: "provider-456",
     recipientId: "patient-123",
     replyTo: "message-id",
     body: "..."
   }
```

## Common Field Types

| Field Type | Firestore Type | Example |
|------------|----------------|---------|
| ID References | string | "patient-doc-id-123" |
| Names | string | "John Doe" |
| Dates | timestamp | Timestamp object |
| Enums | string | "active", "scheduled" |
| Lists | array | ["allergy1", "allergy2"] |
| Nested Objects | map | { street: "...", city: "..." } |
| Booleans | boolean | true, false |
| Numbers | number | 30, 150.00 |
| Server Timestamps | timestamp | FieldValue.serverTimestamp() |

## Index Requirements

All collections require these standard indexes:
- Single-field indexes on commonly queried fields
- Composite indexes for multi-field queries (defined in implementation-guide.md)

## Naming Conventions

- **Collections**: Lowercase, plural (e.g., `patients`, `appointments`)
- **Document IDs**: Auto-generated or UUID format
- **Fields**: camelCase (e.g., `firstName`, `appointmentDate`)
- **Enum values**: Lowercase with hyphens (e.g., `in-progress`, `primary-care`)
- **Timestamps**: Always use Firestore Timestamp objects
- **References**: Include "Id" suffix (e.g., `patientId`, `providerId`)

## Security Rules Summary

```javascript
patients:      Own data + providers/admins
providers:     Public read, own write + admins
appointments:  Participants only
notes:         Patient + provider + admins
payments:      Patient + billing staff + admins
messages:      Sender + recipient only
```

## Performance Tips

1. **Denormalize frequently accessed data** (names, dates)
2. **Use pagination** for large result sets (limit + startAfter)
3. **Index strategically** - required for complex queries
4. **Batch related writes** - reduces cost and improves consistency
5. **Cache provider profiles** - they change infrequently
6. **Use real-time listeners sparingly** - high read cost
7. **Archive old data** - move completed appointments to archive collection

## Common Pitfalls to Avoid

❌ **Don't**:
- Query without indexes
- Use subcollections for frequently queried data
- Store large binary data in Firestore (use Cloud Storage)
- Forget to paginate large result sets
- Use real-time listeners for infrequent updates
- Hard-delete sensitive data (use status flags)

✅ **Do**:
- Use composite indexes for complex queries
- Denormalize for read performance
- Store file URLs, not file data
- Implement cursor-based pagination
- Use get() when real-time isn't needed
- Soft-delete with status or archive flags

## Support

For detailed information, refer to:
- [Schema files](.) - Complete field definitions
- [Implementation Guide](./implementation-guide.md) - Setup instructions
- [Security & Scalability](./security-scalability.md) - Best practices
