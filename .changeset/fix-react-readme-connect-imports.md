---
"@nylas/react": patch
---

Fix the import path in the README's Connect examples. `useNylasConnect` and `NylasConnectButton` are only exported from the `@nylas/react/connect` subpath, so the snippets that imported them from `@nylas/react` could not resolve.
