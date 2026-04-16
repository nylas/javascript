---
"@nylas/react": patch
---

Upgrade @nylas/web-elements dependency to 2.5.4:

- [nylas-scheduler-editor] Fix calendar not immediately reflecting newly created, updated, or deleted events. Events now appear or disappear without requiring a page reload.

- scheduler Fix radio button fields in booking forms capturing the field label instead of the selected option value. Radio button selections now correctly appear in confirmation emails.

- Fixed scheduler date picker page disappearing in reschedule mode when external JavaScript sets inline styles on shadow DOM elements. Added VDOM key to the footer element to prevent Stencil from reusing it by position during loading-to-content transitions. Also exposed ns_footer CSS part on the footer element for external styling.
