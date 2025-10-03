# Firestore Schema Visual Diagrams

This document provides visual representations of the Firestore schema structure and relationships.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cordia Healthcare Platform                    │
│                        Firebase Firestore                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
        ┌───────▼──────┐  ┌─────▼─────┐  ┌──────▼───────┐
        │   Patients   │  │ Providers  │  │ Appointments │
        │  Collection  │  │ Collection │  │  Collection  │
        └──────┬───────┘  └─────┬──────┘  └──────┬───────┘
               │                │                │
               └────────┬───────┴────────┬───────┘
                        │                │
              ┌─────────▼──────┐  ┌──────▼───────┐
              │     Notes      │  │   Payments   │
              │   Collection   │  │  Collection  │
              └────────────────┘  └──────────────┘
                        │                │
                        └────────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │   Messages   │
                          │  Collection  │
                          └──────────────┘
```

## Collection Relationships

```
┌──────────────────┐
│    PATIENTS      │
│ ─────────────── │
│ • userId         │───────┐
│ • email          │       │
│ • profile        │       │
│ • medicalInfo    │       │                ┌──────────────────┐
│ • insurance      │       │                │   APPOINTMENTS   │
│ • status         │       │                │ ──────────────── │
└──────────────────┘       │                │ • patientId      │──┐
         │                 │         ┌──────│ • providerId     │  │
         │                 └─────────┤      │ • appointmentDate│  │
         │                           │      │ • type           │  │
         │                           │      │ • status         │  │
         │                 ┌─────────┘      │ • location       │  │
         │                 │                └──────────────────┘  │
         │                 │                         │            │
┌────────▼────────┐        │                ┌────────▼──────────┐ │
│    PROVIDERS    │        │                │      NOTES        │ │
│ ─────────────── │        │                │ ───────────────── │ │
│ • userId        │────────┘                │ • patientId       │─┤
│ • email         │                         │ • providerId      │ │
│ • profile       │─────────────────────────│ • appointmentId   │─┘
│ • credentials   │                         │ • content (SOAP)  │
│ • specialization│                         │ • diagnoses       │
│ • workSchedule  │                         │ • vitalSigns      │
└─────────────────┘                         └───────────────────┘
         │                                           │
         │                                           │
         │                 ┌─────────────────────────┘
         │                 │
         │        ┌────────▼──────────┐
         │        │     PAYMENTS      │
         │        │ ───────────────── │
         │        │ • patientId       │
         │        │ • appointmentId   │
         │        │ • invoiceNumber   │
         │        │ • amount          │
         │        │ • status          │
         │        └───────────────────┘
         │
         │        ┌───────────────────┐
         └────────│    MESSAGES       │
                  │ ───────────────── │
                  │ • threadId        │
                  │ • senderId        │
                  │ • recipientId     │
                  │ • subject         │
                  │ • body            │
                  │ • status          │
                  └───────────────────┘
```

## Data Flow: Complete Patient Visit

```
1. SEARCH PROVIDERS
   ┌────────────┐
   │  Patient   │
   └─────┬──────┘
         │
         ▼
   [Query providers collection]
         │
         ▼
   ┌────────────┐
   │ Providers  │
   │ Results    │
   └────────────┘

2. BOOK APPOINTMENT
   ┌────────────┐
   │  Patient   │
   └─────┬──────┘
         │
         ▼
   [Create appointment]
         │
         ▼
   ┌────────────┐
   │Appointments│──┐
   └────────────┘  │
                   │
                   ▼
              [Send message]
                   │
                   ▼
              ┌────────┐
              │Messages│
              └────────┘

3. CLINICAL VISIT
   ┌────────────┐
   │  Provider  │
   └─────┬──────┘
         │
         ├──▶ [Update appointment: check-in]
         │         │
         │         ▼
         │    ┌────────────┐
         │    │Appointments│
         │    └────────────┘
         │
         ├──▶ [Create clinical note]
         │         │
         │         ▼
         │    ┌────────────┐
         │    │   Notes    │
         │    └────────────┘
         │
         └──▶ [Generate invoice]
                   │
                   ▼
              ┌────────────┐
              │  Payments  │
              └────────────┘

4. POST-VISIT
   ┌────────────┐
   │   System   │
   └─────┬──────┘
         │
         ├──▶ [Update appointment: completed]
         │         │
         │         ▼
         │    ┌────────────┐
         │    │Appointments│
         │    └────────────┘
         │
         ├──▶ [Update patient: lastVisit]
         │         │
         │         ▼
         │    ┌────────────┐
         │    │  Patients  │
         │    └────────────┘
         │
         └──▶ [Send follow-up message]
                   │
                   ▼
              ┌────────────┐
              │  Messages  │
              └────────────┘
```

## Document Structure Examples

### Patient Document
```
patients/{patientId}
├── userId: "auth-uid-123"
├── email: "john.doe@example.com"
├── profile: {
│   ├── firstName: "John"
│   ├── lastName: "Doe"
│   ├── dateOfBirth: Timestamp
│   ├── gender: "male"
│   ├── phoneNumber: "+1-555-1234"
│   └── address: { ... }
├── medicalInfo: {
│   ├── bloodType: "A+"
│   ├── allergies: ["Penicillin"]
│   ├── medications: ["Lisinopril"]
│   └── conditions: ["Hypertension"]
├── insurance: { ... }
├── status: "active"
├── createdAt: Timestamp
├── updatedAt: Timestamp
└── lastVisit: Timestamp
```

### Appointment Document
```
appointments/{appointmentId}
├── patientId: "patient-123"
├── patientName: "John Doe"
├── providerId: "provider-456"
├── providerName: "Dr. Smith"
├── appointmentDate: Timestamp
├── duration: 30
├── type: "telehealth"
├── reason: "Annual checkup"
├── status: "scheduled"
├── location: {
│   ├── type: "telehealth"
│   └── telehealth: {
│       ├── platform: "Zoom"
│       └── meetingLink: "..."
├── reminders: { ... }
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### Note Document (SOAP Format)
```
notes/{noteId}
├── patientId: "patient-123"
├── providerId: "provider-456"
├── appointmentId: "appt-789"
├── noteType: "progress-note"
├── encounterDate: Timestamp
├── title: "Annual Physical"
├── content: {
│   ├── subjective: "Patient reports..."
│   ├── objective: "BP: 128/82..."
│   ├── assessment: "1. Hypertension..."
│   └── plan: "Continue medications..."
├── diagnoses: [
│   { code: "I10", description: "Hypertension" }
├── medications: [ ... ]
├── vitalSigns: { ... }
├── status: "finalized"
├── signature: { ... }
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

## Query Patterns with Indexes

### Pattern 1: Patient's Upcoming Appointments
```
Query:
  appointments
    .where('patientId', '==', 'patient-123')
    .where('appointmentDate', '>', now)
    .orderBy('appointmentDate', 'asc')

Required Index:
  ├── patientId (ascending)
  └── appointmentDate (ascending)
```

### Pattern 2: Provider's Schedule
```
Query:
  appointments
    .where('providerId', '==', 'provider-456')
    .where('status', '==', 'scheduled')
    .orderBy('appointmentDate', 'asc')

Required Index:
  ├── providerId (ascending)
  ├── status (ascending)
  └── appointmentDate (ascending)
```

### Pattern 3: Find Providers
```
Query:
  providers
    .where('specialization', 'array-contains', 'Primary Care')
    .where('acceptingNewPatients', '==', true)
    .where('status', '==', 'active')

Required Index:
  ├── specialization (array-contains)
  ├── acceptingNewPatients (ascending)
  └── status (ascending)
```

### Pattern 4: Unread Messages
```
Query:
  messages
    .where('recipientId', '==', 'user-123')
    .where('status.read', '==', false)
    .orderBy('createdAt', 'desc')

Required Index:
  ├── recipientId (ascending)
  ├── status.read (ascending)
  └── createdAt (descending)
```

## Security Rule Flow

```
                    ┌──────────────┐
                    │   Request    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Authenticated?│
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Check Role  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐    ┌─────▼─────┐
   │ Patient │      │  Provider   │    │   Admin   │
   └────┬────┘      └──────┬──────┘    └─────┬─────┘
        │                  │                  │
        │                  │                  │
   ┌────▼────────────┐ ┌───▼──────────┐ ┌────▼──────────┐
   │ Own data only   │ │ Patient data │ │ All data      │
   │ - My patients   │ │ - My patients│ │ - Full access │
   │ - My appts      │ │ - My schedule│ │ - Manage all  │
   │ - My payments   │ │ - My notes   │ │               │
   │ - My messages   │ │ - Messages   │ │               │
   └─────────────────┘ └──────────────┘ └───────────────┘
```

## Scalability Considerations

```
┌─────────────────────────────────────────┐
│         Load Distribution               │
└─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼───┐  ┌───▼────┐  ┌───▼────┐
   │ Region │  │ Region │  │ Region │
   │   US   │  │   EU   │  │  Asia  │
   └────┬───┘  └───┬────┘  └───┬────┘
        │          │           │
        └──────────┼───────────┘
                   │
        ┌──────────▼──────────┐
        │   Firestore Multi-  │
        │   Region Replication│
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Automatic Caching │
        │   - Client cache    │
        │   - Server cache    │
        └─────────────────────┘
```

## Implementation Checklist

```
Phase 1: Setup
├── [✓] Create Firebase project
├── [✓] Enable Firestore
├── [✓] Review schema documentation
└── [✓] Plan data structure

Phase 2: Collections
├── [ ] Create patients collection
├── [ ] Create providers collection
├── [ ] Create appointments collection
├── [ ] Create notes collection
├── [ ] Create payments collection
└── [ ] Create messages collection

Phase 3: Security
├── [ ] Deploy security rules
├── [ ] Configure authentication
├── [ ] Set up custom claims
└── [ ] Test access controls

Phase 4: Indexes
├── [ ] Deploy composite indexes
├── [ ] Test query performance
└── [ ] Monitor index usage

Phase 5: Testing
├── [ ] Unit tests
├── [ ] Integration tests
├── [ ] Load tests
└── [ ] Security tests

Phase 6: Launch
├── [ ] Sign HIPAA BAA
├── [ ] Enable audit logging
├── [ ] Configure backups
├── [ ] Set up monitoring
└── [ ] Deploy to production
```

## References

- **patients.json** - Complete patient schema
- **providers.json** - Complete provider schema
- **appointments.json** - Complete appointment schema
- **notes.json** - Complete clinical notes schema
- **payments.json** - Complete payment schema
- **messages.json** - Complete messaging schema
- **implementation-guide.md** - Step-by-step setup
- **security-scalability.md** - Best practices
- **QUICK-REFERENCE.md** - Developer quick reference
