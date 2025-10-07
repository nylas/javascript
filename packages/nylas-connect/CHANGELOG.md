# @nylas/connect

## 1.0.0

### Major Changes

- 2408953: Add custom code exchange functionality for enhanced security.

  ### Usage

  ```typescript
  // Handle code exchange on your backend
  const nylasConnect = new NylasConnect({
    clientId: "your-client-id",
    redirectUri: "http://localhost:3000/callback",
    codeExchange: async (params) => {
      const response = await fetch("/api/auth/exchange", {
        method: "POST",
        body: JSON.stringify(params),
      });
      return await response.json();
    },
  });

  // Use normally - custom exchange is called automatically
  const result = await nylasConnect.connect({ method: "popup" });
  ```

## 0.1.0

### Minor Changes

- 356ac8f: Add automatic API URL version suffix handling

  The NylasConnect client now automatically appends `/v3` to API URLs that don't already have a version suffix. This ensures all API calls use versioned endpoints while preserving any explicitly set versions.

  **Features:**
  - Automatically appends `/v3` to API URLs without version suffixes
  - Preserves existing version suffixes (e.g., `/v1`, `/v2`, `/v10`)
  - Handles trailing slashes correctly
  - Works with custom API URLs and regional endpoints

  **Examples:**
  - `https://api.us.nylas.com` → `https://api.us.nylas.com/v3`
  - `https://api.us.nylas.com/v2` → `https://api.us.nylas.com/v2` (unchanged)
  - `https://custom.api.com` → `https://custom.api.com/v3`

  This change is backward compatible and doesn't affect existing functionality.

## 0.0.3

### Patch Changes

- 2ef30c8: Fix NPM publishing configuration by adding publishConfig for scoped package access

## 0.0.2

### Patch Changes

- 255906c: Add Husky git hooks: pre-commit and pre-push run ggshield secret scans.
- 429e6b9: fix: correct GitHub Actions release workflow commands

  Fixed the changesets action to use proper script commands instead of tool version output, and added NODE_AUTH_TOKEN for NPM authentication.

- 255906c: Validating the github actions workflow
