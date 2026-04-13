---
"@nylas/react": patch
---

- [nylas-scheduling] Fixed confirmation redirect URL incorrectly appending query parameters with ? instead of & when the confirmationRedirectUrl already contains existing query parameters. URLs with pre-existing parameters (e.g. JWT tokens) now correctly preserve all query parameters.

- Fix deferred initialization when rescheduleBookingRef or cancelBookingRef is set via JavaScript after mount (CDN / vanilla HTML pattern). Watch handlers now emit the bookingRefExtracted event, include error handling for malformed booking refs, and properly coordinate with the base provider during deferred init.

- [nylas-page-styling] The Page Styles section in the scheduler editor now renders translated labels by default when no custom slot content is provided. Labels for "Company logo URL", "Primary color", "Submit button label", and "Thank you message" are now available in all supported languages (en, es, fr, de, sv, zh, ja, nl, ko). The color picker's "Select a color" placeholder is also now translated.
