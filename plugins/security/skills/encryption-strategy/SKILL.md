---
description: Plan encryption at rest, in transit, and key management
---

# Encryption Strategy

Plan encryption at rest, in transit, and key management for "$ARGUMENTS". Define encryption requirements based on data classification, select appropriate algorithms, and design the key management lifecycle.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Inventory data requiring encryption:**
   - Map data types to classification levels (public, internal, confidential, restricted)
   - Identify regulatory encryption requirements (PCI DSS, HIPAA, GDPR, SOC 2)
   - Catalog data storage locations (databases, object storage, file systems, backups, caches)
   - Identify data flows between systems, services, and external parties

2. **Plan encryption at rest:**
   - Select encryption algorithm (AES-256 recommended for symmetric encryption)
   - Evaluate database-level encryption (TDE) vs. application-level encryption
   - Database-level: simpler to implement, protects against physical media theft
   - Application-level: protects against database administrator access, enables field-level encryption
   - Plan encryption for file storage and object storage (S3 SSE, Azure Storage encryption)
   - Define encryption requirements for backup media and archives

3. **Plan encryption in transit:**
   - Require TLS 1.3 minimum for all external communications (deprecate TLS 1.2 where possible)
   - Define certificate management strategy (public CA vs. internal CA, certificate lifecycle)
   - Plan mutual TLS (mTLS) for service-to-service communication where appropriate
   - Configure cipher suite preferences (forward secrecy required, disable weak ciphers)
   - Implement certificate pinning for critical mobile and API connections if applicable

4. **Design key management:**
   - Select KMS solution (AWS KMS, Azure Key Vault, GCP Cloud KMS, HashiCorp Vault)
   - Define key hierarchy (master key, data encryption keys, key encryption keys)
   - Set key rotation schedule (master keys: annually, data encryption keys: quarterly or per-use)
   - Plan key backup and recovery procedures
   - Define key access controls (who can create, rotate, and revoke keys)
   - Document key compromise response procedure (re-encryption plan)

5. **Evaluate client-side vs. server-side encryption:**
   - Client-side encryption for data the server should never see (zero-knowledge scenarios)
   - Server-side encryption for simpler key management and transparent encryption
   - End-to-end encryption for messaging and communication features
   - Document the decision rationale for each data type

6. **Plan encryption for backups:**
   - Ensure all backups are encrypted with separate keys from production
   - Define backup key escrow and recovery procedures
   - Test backup decryption as part of disaster recovery exercises
   - Set retention-aligned key lifecycle (keys must outlive encrypted backup retention)

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## Encryption Strategy

   Include sections:
   - **Data Encryption Requirements** — data types, classification levels, and regulatory requirements
   - **Encryption at Rest** — algorithms, implementation approach per storage type
   - **Encryption in Transit** — TLS configuration, certificate management, mTLS plan
   - **Key Management** — KMS selection, key hierarchy, rotation schedule, and access controls
   - **Client-Side vs. Server-Side** — decisions per data type with rationale
   - **Backup Encryption** — backup-specific encryption and key escrow plan

## Output

The encryption strategy written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Data types requiring encryption and their classification levels
- Encryption approach per storage and transit scenario
- Key management solution and rotation schedule
- Critical decisions on client-side vs. server-side encryption
