---
"@nylas/react": minor
---

Upgrade @nylas/web-elements dependency to 2.5.0-canary-20260310171201

### Minor Changes

- Added `nylasSchedulerEditorError` event to `nylas-scheduler-editor` that captures and re-emits errors from child components. In React, use the `onNylasSchedulerEditorError` prop to handle errors from the editor and its children in a single place.

### Patch Changes

- Fixed `nylas-scheduler-editor` showing the configuration list in composable mode instead of rendering the slotted content
- Fixed cancel and reschedule flows breaking when a booking ref was provided without a session ID by deferring scheduler initialization
- Fixed cancel after reschedule failing because stale booking IDs were retained. After rescheduling (which creates new booking IDs), the scheduler now correctly updates to the new IDs so subsequent cancel operations target the rescheduled booking.
- Fixed participant availability and booking calendars not populating when editing an existing configuration due to a prop ordering race condition. Also fixed round-robin participants incorrectly showing the organizer's calendars instead of their own.
- Fixed participant search in the scheduler editor: search results are now properly added to the participant options store, the dropdown no longer disappears prematurely when selecting a result, and the currently-edited participant row is excluded from duplicate filtering
- Fixed a bug where the organizer participant's grant_id was dropped when saving a scheduler configuration. The grant_id is now preserved for both organizer and non-organizer participants during edit and save operations. Additionally, async participants added via search or fetch callbacks can now optionally include a grant_id that flows through to the saved configuration.
- Fixed round-robin configurations not correctly identifying the organizer, which could cause calendar selection and booking calendar assignment to fail when editing an existing round-robin config
