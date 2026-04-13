---
"@nylas/react": patch
---

Upgrade @nylas/web-elements dependency to 2.5.2:
- Fix schedulerApiUrl not being applied before the connector's first API call when using React wrappers on a full page refresh. The connector now syncs the latest schedulerApiUrl prop value before every data fetch, ensuring EU and other non-US regions work correctly regardless of prop timing.

- [nylas-scheduling] The scheduler now automatically detects the user's browser language and displays localized content when a supported language is available. Previously, users always saw English unless the ?lang= URL parameter or defaultLanguage prop was explicitly set.
