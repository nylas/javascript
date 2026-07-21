---
"@nylas/react": patch
---

Sync generated React component wrappers with @nylas/web-elements 2.5.0

The auto-generated `components.ts` file was out of date with the published @nylas/web-elements 2.5.0 types. This updates the React wrapper types to match the latest Stencil output, including new types like `AdditionalParticipant` and `NylasAdditionalParticipantsCustomEvent`, and updated component definitions.
