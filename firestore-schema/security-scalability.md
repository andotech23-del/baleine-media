# Security and Scalability Considerations

This document outlines critical security and scalability considerations for the Cordia Healthcare Platform Firestore schema.

## Security Considerations

### 1. HIPAA Compliance

The Cordia Healthcare Platform handles Protected Health Information (PHI) and must comply with HIPAA regulations.

#### Required Actions:
- **Sign BAA with Google Cloud**: Before storing any PHI, sign a Business Associate Agreement
- **Enable audit logging**: Track all access to patient data
- **Encryption**: Use Firebase's built-in encryption at rest and in transit
- **Access controls**: Implement strict role-based access control (RBAC)

#### Implementation Checklist:
- [ ] Sign Google Cloud BAA
- [ ] Enable Cloud Audit Logs
- [ ] Configure VPC Service Controls (optional, for enterprise)
- [ ] Implement multi-factor authentication
- [ ] Regular security audits and penetration testing

### 2. Authentication and Authorization

#### Firebase Authentication Setup:
```javascript
// Required auth providers
- Email/Password (primary)
- Phone (for 2FA)
- Social providers (optional: Google, Apple)
```

#### Custom Claims for Role-Based Access:
```javascript
// Set custom claims via Admin SDK
admin.auth().setCustomUserClaims(uid, {
  role: 'provider',
  providerId: 'provider-doc-id-123',
  permissions: ['read:patients', 'write:notes', 'read:appointments']
});
```

#### Security Rules with Custom Claims:
```javascript
function hasRole(role) {
  return request.auth.token.role == role;
}

function hasPermission(permission) {
  return permission in request.auth.token.permissions;
}
```

### 3. Data Encryption

#### Client-Side Encryption for Extra-Sensitive Data:
For highly sensitive fields (SSN, credit card), consider client-side encryption:

```javascript
// Example: Encrypt before storing
const crypto = require('crypto');

function encryptField(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}
```

**Note**: Store encryption keys in Google Cloud KMS, not in your application code.

### 4. Audit Logging

Implement comprehensive audit trails for all PHI access:

```javascript
// Audit log collection structure
{
  collection: "audit_logs",
  schema: {
    userId: "string",
    action: "string", // read, write, update, delete
    resource: "string", // patients/{id}, notes/{id}
    timestamp: "timestamp",
    ipAddress: "string",
    userAgent: "string",
    result: "string" // success, failure
  }
}
```

### 5. Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Use Firebase App Check
// Configure in Firebase Console

// Additional rate limiting in Cloud Functions
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 6. Data Masking

Mask sensitive data in logs and non-production environments:

```javascript
function maskEmail(email) {
  const [name, domain] = email.split('@');
  return `${name.substring(0, 2)}***@${domain}`;
}

function maskSSN(ssn) {
  return `***-**-${ssn.slice(-4)}`;
}
```

## Scalability Considerations

### 1. Collection Design

#### Current Design Benefits:
- **Flat structure**: Top-level collections for primary entities
- **Strategic denormalization**: Commonly accessed data (names, dates) duplicated for read performance
- **Appropriate subcollections**: Can be added for nested data (e.g., patient visits under patients)

#### When to Use Subcollections:
```javascript
// Good use case: Patient appointments subcollection
patients/{patientId}/appointments/{appointmentId}

// Benefit: Automatic cleanup when patient deleted
// Trade-off: More complex queries across all patients
```

### 2. Query Optimization

#### Composite Indexes:
All required composite indexes are defined in `implementation-guide.md`. Key patterns:

```javascript
// Efficient: Indexed query
db.collection('appointments')
  .where('providerId', '==', providerId)
  .where('status', '==', 'scheduled')
  .orderBy('appointmentDate', 'asc')
  .limit(10);

// Inefficient: Full collection scan
db.collection('appointments')
  .where('notes', '>', '') // Non-indexed field
  .get();
```

#### Query Best Practices:
1. **Use pagination**: Always limit results and use cursors
2. **Index strategically**: Don't over-index; each index costs storage
3. **Denormalize for reads**: Duplicate data that's frequently queried together
4. **Use array-contains wisely**: Index arrays that will be searched

### 3. Pagination Strategy

Implement cursor-based pagination for large datasets:

```javascript
// Initial query
let query = db.collection('patients')
  .orderBy('createdAt', 'desc')
  .limit(20);

// Get first page
const firstPage = await query.get();

// Get next page
const lastVisible = firstPage.docs[firstPage.docs.length - 1];
const nextPage = await query
  .startAfter(lastVisible)
  .get();
```

### 4. Write Optimization

#### Batch Writes:
Group related writes to reduce costs and improve performance:

```javascript
const batch = db.batch();

// Update appointment
batch.update(appointmentRef, { status: 'completed' });

// Create note
batch.set(noteRef, noteData);

// Update patient's lastVisit
batch.update(patientRef, { 
  lastVisit: admin.firestore.FieldValue.serverTimestamp() 
});

await batch.commit();
```

#### Transaction Limits:
- Max 500 documents per transaction
- Max 10 MiB per transaction
- Use batches for non-dependent writes

### 5. Data Sharding

For very large collections (millions of documents), consider sharding:

```javascript
// Example: Shard messages by date
function getMessagesCollection(date) {
  const month = date.toISOString().substring(0, 7); // YYYY-MM
  return db.collection(`messages_${month}`);
}

// Query specific shard
const messagesRef = getMessagesCollection(new Date());
```

### 6. Caching Strategy

Implement multi-level caching:

```javascript
// 1. Browser cache (for static provider data)
// 2. CDN cache (for public assets)
// 3. Application cache (Redis/Memcached)
// 4. Firestore cache (automatic)

// Example: Cache provider profiles
const providerCache = new Map();

async function getProvider(providerId) {
  if (providerCache.has(providerId)) {
    return providerCache.get(providerId);
  }
  
  const doc = await db.collection('providers').doc(providerId).get();
  const data = doc.data();
  providerCache.set(providerId, data);
  return data;
}
```

### 7. Real-time Listeners Management

Use listeners judiciously to avoid excessive read costs:

```javascript
// Good: Limited scope listener
const unsubscribe = db.collection('messages')
  .where('recipientId', '==', userId)
  .where('status.read', '==', false)
  .limit(50)
  .onSnapshot(snapshot => {
    // Update UI
  });

// Don't forget to unsubscribe
unsubscribe();

// Bad: Broad listener
db.collection('appointments').onSnapshot(/* ... */); // Watches ALL appointments
```

### 8. Cloud Functions Optimization

Use Cloud Functions for complex operations:

```javascript
// Example: Scheduled cleanup of old data
exports.cleanupOldAppointments = functions.pubsub
  .schedule('0 2 * * *') // Daily at 2 AM
  .onRun(async (context) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const snapshot = await db.collection('appointments')
      .where('status', '==', 'completed')
      .where('appointmentDate', '<', sixMonthsAgo)
      .limit(500)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'archived' });
    });
    
    await batch.commit();
  });
```

### 9. Monitoring and Alerts

Set up monitoring for:

```yaml
Metrics to Monitor:
  - Read/Write operations per second
  - Document count per collection
  - Index size
  - Query latency
  - Failed security rule checks
  - Cost per day

Alerts to Configure:
  - Unusual spike in operations
  - High query latency (>1s)
  - Security rule violations
  - Daily cost threshold exceeded
```

### 10. Cost Optimization

#### Strategies to Reduce Costs:
1. **Use get() instead of onSnapshot()** when real-time isn't needed
2. **Implement proper pagination** to limit reads
3. **Cache frequently accessed data** 
4. **Clean up old data** regularly
5. **Use Cloud Storage for large files**, not Firestore documents
6. **Optimize indexes** - remove unused ones
7. **Denormalize to reduce joins** (document reads)

#### Cost Estimation:
```javascript
// Approximate costs (US multi-region)
Document writes: $0.18 per 100K
Document reads: $0.06 per 100K
Document deletes: $0.02 per 100K
Storage: $0.18 per GB/month

// Example monthly cost for moderate usage:
// 1M writes + 5M reads + 1GB storage = ~$5-10/month
```

## Disaster Recovery

### Backup Strategy

1. **Enable Automated Backups** (Firebase Console):
   - Daily backups
   - 30-day retention
   - Point-in-time recovery

2. **Export Important Collections** regularly:
```bash
gcloud firestore export gs://[BUCKET_NAME] \
  --collection-ids=patients,providers,appointments
```

3. **Test Restore Procedures** quarterly

### Data Retention Policy

```javascript
// Retention periods (example)
const retentionPolicy = {
  patients: 'indefinite', // Keep while active
  providers: 'indefinite',
  appointments: '7 years', // Legal requirement
  notes: '7 years',
  payments: '7 years',
  messages: '2 years',
  audit_logs: '7 years'
};
```

## Performance Benchmarks

Expected query performance targets:

| Query Type | Target Latency | Max Latency |
|------------|----------------|-------------|
| Single document read | <50ms | 200ms |
| Indexed query (≤100 docs) | <100ms | 500ms |
| Complex composite query | <200ms | 1s |
| Write operation | <100ms | 500ms |
| Batch write (50 docs) | <500ms | 2s |

## Load Testing

Before production launch:

```javascript
// Use tools like:
// - Apache JMeter
// - k6.io
// - Artillery

// Test scenarios:
// 1. Concurrent user logins (100 users)
// 2. Appointment booking surge (50 concurrent)
// 3. Provider search (100 concurrent queries)
// 4. Message load (1000 messages/minute)
```

## Compliance Checklist

- [ ] HIPAA BAA signed with Google Cloud
- [ ] Security rules implemented and tested
- [ ] Audit logging enabled
- [ ] Data encryption configured
- [ ] Access controls implemented
- [ ] Backup and disaster recovery tested
- [ ] Incident response plan documented
- [ ] Privacy policy updated
- [ ] Staff training completed
- [ ] Regular security audits scheduled

## Support and Resources

- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [HIPAA Compliance on Google Cloud](https://cloud.google.com/security/compliance/hipaa)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Cloud Healthcare API](https://cloud.google.com/healthcare-api) (for additional HIPAA features)
