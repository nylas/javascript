---
"@nylas/connect": major
---

Add custom code exchange functionality for enhanced security.

### Usage

```typescript
// Handle code exchange on your backend
const nylasConnect = new NylasConnect({
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  codeExchange: async (params) => {
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

