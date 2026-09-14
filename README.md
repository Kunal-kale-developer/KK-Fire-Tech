# FormB360

Fire-safety compliance tracker for KKFire Tech — keeps Form B renewals, AMC
schedules and Fire NOC dates on track for architects, designers, AMC
vendors and society chairmen across Maharashtra.

## Structure

```
formb360/
├── backend/     Spring Boot (Gradle), Java 17, PostgreSQL, JPA
└── frontend/    Next.js 14 (App Router), TypeScript, Tailwind CSS
```

## Domain model (v1)

- **Building** — the property being tracked (society, chairman contact)
- **Stakeholder** — architect / designer / vendor / chairman, linked to buildings
- **ComplianceItem** — a Form B / AMC / Fire NOC record with a `validUntil` date;
  its status (`VALID` / `DUE_SOON` / `EXPIRED`) is computed on read, not stored
- **ComplianceDocument** — an uploaded certificate tied to a ComplianceItem
- **Reminder** — a scheduled nudge (email/WhatsApp/SMS) before expiry

## Running the backend

Requires Java 17 and a local PostgreSQL instance.

```bash
cd backend
createdb formb360          # or adjust src/main/resources/application.yml
./gradlew bootRun
```

API comes up on `http://localhost:8080/api`. Key endpoints:

- `GET/POST /api/buildings`
- `GET/POST /api/stakeholders?role=ARCHITECT`
- `GET/POST /api/compliance-items?buildingId=1`
- `GET /api/compliance-items/expiring?withinDays=30` — feeds the dashboard

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`, calling the backend at
`http://localhost:8080/api` by default (override with
`NEXT_PUBLIC_API_BASE_URL`).

## Not yet built (next steps)

- Auth + RBAC so a vendor only sees their assigned buildings, a chairman
  only sees theirs (Spring Security dependency is already in `build.gradle`,
  commented out)
- File upload endpoint + storage (S3) for `ComplianceDocument`
- A scheduled job that walks `ComplianceItemRepository.findExpiringBy(...)`
  daily and creates/send `Reminder`s (email first, WhatsApp via a
  Business API provider next)
- Building detail page + forms to add buildings/compliance items from the UI
  (current pages are read-only, wired to real endpoints)
