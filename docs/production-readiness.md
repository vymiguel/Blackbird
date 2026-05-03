# Blackbird Production Readiness

## Authentication

The current app keeps the fast admin/driver PIN flow for continuity, but this should not be the final production security model.

Before client launch:

- Replace plain PINs with Convex Auth, WorkOS AuthKit, Clerk, Auth0, or another OIDC provider.
- If a PIN flow remains, store only salted password/PIN hashes. Never store plaintext PINs.
- Add roles and permissions on the Convex backend, not only in the React UI.
- Require admin-only mutations for worker/rate/plate edits.

## Audit Fields

The Convex schema includes audit-friendly fields:

- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

The shared state bridge also writes to `auditLog` whenever a state blob changes.

As the app is normalized, preserve audit fields on `workers`, `shifts`, `fuelEntries`, and `plates`.

## Backend Payroll Logic

`convex/payroll.ts` contains the first backend payroll summary function. The UI still performs local calculations for immediate continuity, but production reports should move to Convex queries so payroll numbers are generated from one trusted backend implementation.

## Backups And Exports

`convex/blackbird.ts` exposes `exportAll`, which returns all operational tables and audit records. Use it as the basis for:

- scheduled backups
- CSV/PDF payroll exports
- fuel report exports
- accountant/admin downloads

## Next Hardening Step

Move from the current shared `appState` compatibility bridge to fully normalized Convex tables:

- `workers`
- `shifts`
- `fuelEntries`
- `plates`

That will make permissions, audits, reporting, and backups much stronger.
