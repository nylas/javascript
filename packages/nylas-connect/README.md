# @nylas/connect

[![npm version](https://img.shields.io/npm/v/@nylas/connect.svg)](https://www.npmjs.com/package/@nylas/connect)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🚀 Modern, secure, developer-friendly OAuth connection for Nylas APIs

## Highlights

- **🔒 Secure by default** - PKCE flow, automatic token management, no secrets in browser
- **⚡ Zero dependencies** - Lightweight, fast, and reliable
- **🎯 TypeScript-first** - Full type safety and IntelliSense support
- **🌐 Universal** - Works in modern browsers and Node.js 18+
- **📱 Flexible flows** - Popup (recommended) or redirect authentication
- **💾 Smart persistence** - Automatic session and token storage

## Install

```bash
npm install @nylas/connect
```

**Prerequisites:** Node.js 18+ and a modern browser

## Usage

```typescript
import { NylasConnect } from '@nylas/connect';

const nylasConnect = new NylasConnect({
  clientId: 'your-nylas-client-id',
  redirectUri: 'http://localhost:3000/auth/callback'
});

// Connect with popup (recommended)
const result = await nylasConnect.connect({ method: 'popup' });
console.log('Connected as:', result.email);
```

Environment variables (recommended):

```typescript
// Use environment variables
const nylasConnect = new NylasConnect();
// Reads from NYLAS_CLIENT_ID and NYLAS_REDIRECT_URI
```

## Connection Methods

### Popup Flow (Recommended)

```typescript
const result = await nylasConnect.connect({ method: 'popup' });
```

- User stays in your app
- Seamless experience
- Best for SPAs

### Redirect Flow

```typescript
const url = await nylasConnect.connect({ method: 'inline' });
window.location.href = url;
```

- Full page redirect
- Works when popups blocked
- Better for mobile

### Callback Handler

```typescript
// At your redirect URI (e.g., /auth/callback)
await nylasConnect.callback();
```

## Environment Setup

```env
NYLAS_CLIENT_ID=your-nylas-client-id
NYLAS_REDIRECT_URI=http://localhost:3000/auth/callback
```

**Note:** With modern bundlers, prefix environment variables:
- Vite: `VITE_NYLAS_CLIENT_ID`
- Next.js: `NEXT_PUBLIC_NYLAS_CLIENT_ID`

## Session Management

```typescript
// Check current session
const session = await nylasConnect.getSession();
if (session) {
  console.log('User:', session.grantInfo?.email);
}

// Logout
await nylasConnect.logout();
```

## Error Handling

```typescript
try {
  await nylasConnect.connect({ method: 'popup' });
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clientId` | `string` | - | Nylas Client ID |
| `redirectUri` | `string` | - | OAuth redirect URI |
| `apiUrl` | `string` | `https://api.us.nylas.com` | API base URL |
| `persistTokens` | `boolean` | `true` | Store tokens in localStorage |
| `debug` | `boolean` | `true` on localhost | Enable debug logging |
| `codeExchange` | (param: CodeExchangeParams) => Promise<ConnectResult>` | - | Custom code exchange method |

## Custom Code Exchange

For enhanced security, you can handle the OAuth code exchange on your backend instead of in the browser. This approach keeps your API keys secure and gives you full control over the token exchange process.

### Backend Code Exchange

```typescript
const nylasConnect = new NylasConnect({
  clientId: 'your-nylas-client-id',
  redirectUri: 'http://localhost:3000/auth/callback',
  codeExchange: async (params) => {
    // Send the authorization code to your backend
    const response = await fetch('/api/auth/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: params.code,
        state: params.state,
        clientId: params.clientId,
        redirectUri: params.redirectUri,
        scopes: params.scopes,
        provider: params.provider,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const tokenData = await response.json();
    
    // Return the expected ConnectResult format
    return {
      accessToken: tokenData.access_token,
      idToken: tokenData.id_token,
      grantId: tokenData.grant_id,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      scope: tokenData.scope,
      grantInfo: tokenData.grant_info,
    };
  }
});

// Use normally - the custom exchange will be called automatically
const result = await nylasConnect.connect({ method: 'popup' });
```

### Backend Implementation Example

```typescript
// Example backend endpoint (/api/auth/exchange)
export async function POST(request: Request) {
  const { code, clientId, redirectUri } = await request.json();
  
  // Exchange code for tokens using your API key
  const response = await fetch('https://api.us.nylas.com/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${process.env.NYLAS_API_KEY}`,
    },
    body: new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await response.json();
  return Response.json(tokenData);
}
```

## API

### `connect(options?)`

Start OAuth flow. Returns `ConnectResult` for popup or URL string for redirect.

```typescript
// Popup
await nylasConnect.connect({ method: 'popup' });

// Redirect
const url = await nylasConnect.connect({ method: 'inline' });
```

### `callback(url?)`

Handle OAuth callback. Auto-detects current URL if none provided.

### `getSession(grantId?)`

Get current session. Returns `null` if no active session.

### `logout(grantId?)`

Clear stored tokens and logout.

## Advanced Usage

### Backend-Only Flow

For server-side token exchange:

```typescript
// Client: build auth URL without PKCE
const { url, state } = await nylasConnect.getAuthUrl();
window.location.href = url;

// Server: exchange code using Nylas Node SDK
const { grantId } = await nylas.auth.exchangeCodeForToken({
  clientId: process.env.NYLAS_CLIENT_ID,
  clientSecret: process.env.NYLAS_CLIENT_SECRET,
  code: req.query.code,
  redirectUri: process.env.NYLAS_REDIRECT_URI
});
```

### Custom Scopes

```typescript
await nylasConnect.connect({
  method: 'popup',
  scopes: ['https://www.googleapis.com/auth/gmail.readonly']
});
```

### Event Handling

```typescript
const unsubscribe = nylasConnect.onConnectStateChange((event, session) => {
  if (event === 'CONNECT_SUCCESS') {
    console.log('Connected:', session?.grantInfo?.email);
  }
});

// Clean up
unsubscribe();
```

## FAQ

### Popup vs Redirect?

**Popup:** Better UX, works in SPAs, requires popup permission  
**Redirect:** Works everywhere, better for mobile, full page navigation

### Do I need custom scopes?

Usually no. Nylas handles default scopes automatically. Override only for specific provider permissions.

### Which region?

Match your Nylas account region:
- US: `https://api.us.nylas.com`
- EU: `https://api.eu.nylas.com`

### Token refresh?

Automatic. @nylas/connect handles token refresh in the background.

## License

MIT © [Nylas](https://nylas.com)