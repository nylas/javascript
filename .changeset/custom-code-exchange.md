---
"@nylas/connect": minor
---

Add custom code exchange functionality for enhanced security

This release adds support for custom OAuth code exchange methods, allowing developers to handle token exchange on their backend for enhanced security. Key features include:

- **Custom Code Exchange**: Inject a custom function to handle authorization code exchange on your backend
- **Automatic PKCE Management**: PKCE is automatically disabled when using custom exchange (not needed for confidential clients)
- **Type Safety**: Full TypeScript support with well-defined interfaces for custom exchange parameters
- **Backward Compatibility**: No breaking changes - existing flows continue to work unchanged
- **Enhanced Security**: Keep API keys secure on the backend while using convenient popup authentication

### Usage

```typescript
const nylasConnect = new NylasConnect({
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  codeExchange: async (params) => {
    // Handle code exchange on your backend
    const response = await fetch('/api/auth/exchange', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return await response.json();
  }
});

// Use normally - custom exchange is called automatically
const result = await nylasConnect.connect({ method: 'popup' });
```

