---
"@nylas/connect": none
---

Add Oxlint as the linter across the workspace and standardize scripts/CI.

- Add `oxlint` as a workspace devDependency
- Use `lint` (auto-fix) and `lint:check` (no fix) across packages
- Configure Nx to cache `lint:check` and skip caching for `lint`
- Update PR workflow to run `pnpm lint:check`

This is a tooling-only change; no runtime impact.


