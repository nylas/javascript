# @nylas/connect

## 0.0.3

### Patch Changes

- 2ef30c8: Fix NPM publishing configuration by adding publishConfig for scoped package access

## 0.0.2

### Patch Changes

- 255906c: Add Husky git hooks: pre-commit and pre-push run ggshield secret scans.
- 429e6b9: fix: correct GitHub Actions release workflow commands

  Fixed the changesets action to use proper script commands instead of tool version output, and added NODE_AUTH_TOKEN for NPM authentication.

- 255906c: Validating the github actions workflow
