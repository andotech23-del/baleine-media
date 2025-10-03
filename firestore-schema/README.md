# Firestore Schema for Cordia Healthcare Platform

This directory contains the complete Firestore database schema design for the Cordia Healthcare Platform. The schema is designed to support scalable queries, secure access, and all required healthcare management features.

## Collections Overview

The Cordia Healthcare Platform uses the following Firestore collections:

1. **patients** - Patient demographic and medical information
2. **providers** - Healthcare provider profiles and credentials
3. **appointments** - Scheduling and appointment management
4. **notes** - Clinical notes and documentation
5. **payments** - Billing and payment records
6. **messages** - Secure messaging between patients and providers

## Design Principles

- **Scalability**: Collections are designed to handle large volumes of data with efficient querying
- **Security**: Each collection supports Firestore security rules for HIPAA-compliant access control
- **Denormalization**: Strategic denormalization for performance optimization
- **Indexing**: Composite indexes defined for common query patterns

## Implementation

See [implementation-guide.md](./implementation-guide.md) for detailed instructions on:
- Creating collections via Firebase Console
- Using Firebase Admin SDK scripts
- Setting up security rules
- Creating required indexes

## Schema Files

Each collection has a detailed schema file:
- [patients.json](./patients.json) - Patient collection schema
- [providers.json](./providers.json) - Provider collection schema
- [appointments.json](./appointments.json) - Appointment collection schema
- [notes.json](./notes.json) - Notes collection schema
- [payments.json](./payments.json) - Payment collection schema
- [messages.json](./messages.json) - Messages collection schema

## Quick Reference

| Collection | Primary Use | Key Indexes |
|------------|-------------|-------------|
| patients | Patient records | email, dateOfBirth |
| providers | Provider profiles | specialization, status |
| appointments | Scheduling | patientId+date, providerId+date |
| notes | Clinical notes | patientId+createdAt, providerId+createdAt |
| payments | Billing | patientId+status, createdAt |
| messages | Communication | senderId+createdAt, recipientId+createdAt |
