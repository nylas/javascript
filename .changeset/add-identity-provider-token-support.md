---
"@nylas/connect": minor
---
- Added `IdentityProviderTokenCallback` type for providing JWT tokens
- Added optional `identityProviderToken` callback to `ConnectConfig`
- Token exchange now uses JSON format instead of form-encoded requests
- Added `idp_claims` field to token exchange when IDP token is provided

