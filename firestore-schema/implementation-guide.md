# Firestore Implementation Guide for Cordia Healthcare Platform

This guide provides step-by-step instructions for implementing the Firestore schema in your Firebase project.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Implementation via Firebase Console](#implementation-via-firebase-console)
3. [Implementation via Firebase Admin SDK](#implementation-via-firebase-admin-sdk)
4. [Security Rules](#security-rules)
5. [Composite Indexes](#composite-indexes)
6. [Data Migration](#data-migration)

## Prerequisites

- Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- Firestore database enabled in the Firebase Console
- Firebase Admin SDK installed (for script-based implementation)
- Node.js 16+ installed (for script-based implementation)

## Implementation via Firebase Console

### Step 1: Access Firestore

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your Cordia Healthcare project
3. Navigate to **Firestore Database** in the left sidebar
4. Click **Create database** if not already created

### Step 2: Create Collections Manually

For each collection (patients, providers, appointments, notes, payments, messages):

1. Click **Start collection**
2. Enter the collection ID (e.g., `patients`)
3. Add a sample document with the structure from the schema files
4. Use the document ID field as needed (auto-generate or custom)

#### Example: Creating Patients Collection

```
Collection ID: patients
Document ID: [Auto-ID] or custom patient ID

Fields:
- userId: string
- email: string
- profile: map
  - firstName: string
  - lastName: string
  - dateOfBirth: timestamp
  - gender: string
  - phoneNumber: string
  - address: map
    - street: string
    - city: string
    - state: string
    - zipCode: string
    - country: string
- medicalInfo: map
  - bloodType: string
  - allergies: array
  - medications: array
  - conditions: array
  - emergencyContact: map
- insurance: map
- status: string
- createdAt: timestamp (use server timestamp)
- updatedAt: timestamp (use server timestamp)
```

Repeat this process for all six collections using the sample documents from each schema file.

## Implementation via Firebase Admin SDK

### Step 1: Setup

Create a new Node.js project for database initialization:

```bash
mkdir cordia-firestore-setup
cd cordia-firestore-setup
npm init -y
npm install firebase-admin
```

### Step 2: Download Service Account Key

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click **Generate new private key**
3. Save the JSON file as `serviceAccountKey.json` in your project directory
4. **IMPORTANT**: Never commit this file to version control

### Step 3: Create Initialization Script

Create a file `initializeFirestore.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample data for each collection
const samplePatient = {
  userId: "firebase-auth-uid-12345",
  email: "john.doe@example.com",
  profile: {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: admin.firestore.Timestamp.fromDate(new Date("1985-06-15")),
    gender: "male",
    phoneNumber: "+1-555-123-4567",
    address: {
      street: "123 Main St",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA"
    }
  },
  medicalInfo: {
    bloodType: "A+",
    allergies: ["Penicillin", "Peanuts"],
    medications: ["Lisinopril 10mg"],
    conditions: ["Hypertension"],
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phoneNumber: "+1-555-987-6543"
    }
  },
  insurance: {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BCBS123456789",
    groupNumber: "GRP001",
    subscriberId: "SUB123456"
  },
  status: "active",
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  lastVisit: admin.firestore.Timestamp.fromDate(new Date("2024-03-15"))
};

const sampleProvider = {
  userId: "firebase-auth-uid-67890",
  email: "dr.smith@cordiahealth.com",
  profile: {
    firstName: "Sarah",
    lastName: "Smith",
    title: "MD",
    phoneNumber: "+1-555-234-5678",
    bio: "Board-certified family medicine physician with 10 years of experience.",
    photoUrl: "https://example.com/photos/dr-smith.jpg"
  },
  credentials: {
    licenseNumber: "MD123456",
    licenseState: "MA",
    npiNumber: "1234567890",
    boardCertifications: ["American Board of Family Medicine"],
    medicalSchool: "Harvard Medical School",
    graduationYear: 2012
  },
  specialization: ["Primary Care", "Family Medicine"],
  languages: ["English", "Spanish"],
  acceptingNewPatients: true,
  rating: {
    average: 4.8,
    count: 127
  },
  status: "active",
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

// Add sample appointment, note, payment, and message data...

async function initializeCollections() {
  try {
    console.log("Initializing Firestore collections...");
    
    // Create patients collection with sample document
    const patientRef = await db.collection('patients').add(samplePatient);
    console.log(`✓ Created patients collection with sample document: ${patientRef.id}`);
    
    // Create providers collection with sample document
    const providerRef = await db.collection('providers').add(sampleProvider);
    console.log(`✓ Created providers collection with sample document: ${providerRef.id}`);
    
    // Create other collections
    await db.collection('appointments').add({
      patientId: patientRef.id,
      providerId: providerRef.id,
      status: "scheduled",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("✓ Created appointments collection");
    
    await db.collection('notes').add({
      patientId: patientRef.id,
      providerId: providerRef.id,
      status: "draft",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("✓ Created notes collection");
    
    await db.collection('payments').add({
      patientId: patientRef.id,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("✓ Created payments collection");
    
    await db.collection('messages').add({
      senderId: patientRef.id,
      recipientId: providerRef.id,
      status: { sent: true, delivered: false, read: false },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("✓ Created messages collection");
    
    console.log("\n✅ All collections initialized successfully!");
    
  } catch (error) {
    console.error("Error initializing collections:", error);
  }
}

// Run initialization
initializeCollections()
  .then(() => {
    console.log("\nInitialization complete. You can now set up indexes and security rules.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
```

### Step 4: Run the Script

```bash
node initializeFirestore.js
```

## Security Rules

Create comprehensive Firestore security rules to protect patient data and ensure HIPAA compliance.

### File: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isProvider() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/providers/$(request.auth.uid));
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Patients collection
    match /patients/{patientId} {
      allow read: if isOwner(resource.data.userId) || isProvider() || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isProvider() || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Providers collection
    match /providers/{providerId} {
      allow read: if isAuthenticated(); // All authenticated users can view providers
      allow create: if isAdmin();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated() && 
                     (resource.data.patientId == request.auth.uid || 
                      resource.data.providerId == request.auth.uid ||
                      isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (resource.data.patientId == request.auth.uid || 
                        resource.data.providerId == request.auth.uid ||
                        isAdmin());
      allow delete: if isAdmin();
    }
    
    // Notes collection
    match /notes/{noteId} {
      allow read: if isAuthenticated() && 
                     (resource.data.patientId == request.auth.uid || 
                      resource.data.providerId == request.auth.uid ||
                      isAdmin());
      allow create: if isProvider() || isAdmin();
      allow update: if resource.data.providerId == request.auth.uid || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if isAuthenticated() && 
                     (resource.data.patientId == request.auth.uid || 
                      isProvider() ||
                      isAdmin());
      allow create: if isProvider() || isAdmin();
      allow update: if isProvider() || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
                     (resource.data.senderId == request.auth.uid || 
                      resource.data.recipientId == request.auth.uid ||
                      isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (resource.data.senderId == request.auth.uid || 
                        resource.data.recipientId == request.auth.uid);
      allow delete: if isAdmin();
    }
  }
}
```

### Deploy Security Rules

Via Firebase Console:
1. Go to Firestore Database > Rules
2. Paste the rules above
3. Click **Publish**

Via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

## Composite Indexes

Firestore requires composite indexes for complex queries. Here's the configuration file:

### File: `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "patients",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "lastVisit", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "providers",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "specialization", "arrayConfig": "CONTAINS" },
        { "fieldPath": "acceptingNewPatients", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "appointmentDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "providerId", "order": "ASCENDING" },
        { "fieldPath": "appointmentDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "providerId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "appointmentDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "notes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "providerId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "payments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "payments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "dueDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "threadId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "recipientId", "order": "ASCENDING" },
        { "fieldPath": "status.read", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Deploy Indexes

Via Firebase Console:
1. Go to Firestore Database > Indexes
2. Create each composite index manually using the **Create Index** button
3. Add fields according to the configuration above

Via Firebase CLI:
```bash
firebase deploy --only firestore:indexes
```

### Automatic Index Creation

Firestore can also create indexes automatically when you run queries that require them. You'll see an error message with a link to create the required index.

## Data Migration

If migrating from an existing system:

### Step 1: Export Existing Data

Export data from your current system to JSON format matching the schema structure.

### Step 2: Create Migration Script

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json')
});

const db = admin.firestore();

async function migrateData(collectionName, dataFile) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const batch = db.batch();
  
  data.forEach(doc => {
    const docRef = db.collection(collectionName).doc();
    batch.set(docRef, doc);
  });
  
  await batch.commit();
  console.log(`Migrated ${data.length} documents to ${collectionName}`);
}

// Run migrations
async function runMigrations() {
  await migrateData('patients', './data/patients.json');
  await migrateData('providers', './data/providers.json');
  // ... other collections
}

runMigrations().catch(console.error);
```

## Testing

After implementation:

1. Test security rules with Firebase Emulator:
```bash
npm install -g firebase-tools
firebase emulators:start
```

2. Verify indexes are working by running queries from your application

3. Monitor Firestore usage in Firebase Console

## Best Practices

1. **Always use server timestamps** for `createdAt` and `updatedAt`
2. **Denormalize strategically** for read performance
3. **Use batch writes** for related document updates
4. **Implement field-level security** in your application logic
5. **Monitor query performance** and add indexes as needed
6. **Regular backups** - Enable daily backups in Firebase Console
7. **HIPAA Compliance** - Sign BAA with Google Cloud if handling PHI

## Support

For issues or questions:
- Firebase Documentation: https://firebase.google.com/docs/firestore
- Firebase Support: https://firebase.google.com/support
- Community: Stack Overflow (tag: google-cloud-firestore)

## Next Steps

1. Set up Firebase Authentication
2. Integrate with your application
3. Implement audit logging
4. Set up monitoring and alerts
5. Configure backup and disaster recovery
