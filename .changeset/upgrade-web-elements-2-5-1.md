---
"@nylas/react": patch
---

Upgrade @nylas/web-elements dependency from 2.5.0 to 2.5.1

- Improve error handling for authentication failures in the scheduler editor. Auth errors now display a visible error banner on the login screen instead of failing silently. The `nylasSchedulerEditorError` event is emitted with `category: 'auth'` for programmatic error handling. Session expiry detection is also improved to catch additional error patterns.
- Fix scheduler date handling to normalize mixed date inputs (Date, ISO string, and unix timestamp values), preventing incorrect fallback dates like 1970 and ensuring timezone-aware selected-day comparisons remain stable across components.
- Fix deferred initialization for booking refs in private scheduler configurations. Booking ref props (reschedule, cancel, organizer confirmation) no longer prematurely trigger initialization without proper auth credentials. Organizer confirmation salt is now correctly persisted when the booking ref is set dynamically.
