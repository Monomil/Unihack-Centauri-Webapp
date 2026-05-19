# Security Specification: CLRE Digital Inclusion

## 1. Data Invariants
- **Identity Integrity**: `uid` must strictly match `request.auth.uid`.
- **System-Enforced Eligibility**: `eligibilityScore` and `priorityLevel` are system-computed; clients cannot set these values to arbitrary high numbers.
- **Relational Locking**: Laptops can only be assigned to users who have a `VALIDATED` eligibility status.
- **Mentor Authority**: Session logs require a valid `mentorSignature` (modeled as a specific field, though fully validated by system in production).

## 2. The Dirty Dozen (Logic Leaks)
1. **Priority Escalation**: User sends `priorityLevel: 10` during signup.
2. **Eligibility Spoof**: User sets `isFSM: true` and `eligibilityScore: 10` manually.
3. **Ghost Update**: User attempts to update `uid` of their profile to a known admin.
4. **Orphaned Session**: Session log created for a non-existent user.
5. **Unauthorized Assignment**: User A assigns Laptop B to themselves.
6. **Hardware Health Bypass**: Manually resetting `lastHealthCheck` without an inspection.
7. **Streak Fabrication**: Incrementing `streak` without a corresponding `Session` document.
8. **Locker Overbooking**: Writing to a locker with `reservedCount` exceeding `totalCapacity`.
9. **PII Exposure**: User A reading User B's `isFSM` status.
10. **Terminal State Reversion**: Changing `status` of a laptop from `DECOMMISSIONED` back to `AVAILABLE`.
11. **ID Poisoning**: Using a 2MB string as a `lockerId`.
12. **Timestamp Fraud**: Setting `updatedAt` to a future date.

## 3. Implementation Plan
- Partitioned collections for PII.
- `isValidUser` logic enforcing `hasOnly` keys for participants.
- `isAdmin` gate for hardware lifecycle management.
