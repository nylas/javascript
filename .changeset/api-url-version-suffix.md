---
"@nylas/connect": minor
---

Add automatic API URL version suffix handling

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
