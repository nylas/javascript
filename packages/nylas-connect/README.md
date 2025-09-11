# @nylas/connect

> Modern, secure, developer-friendly connection for Nylas APIs.

- ESM-only, TypeScript-first, zero runtime deps
- Works in modern browsers and Node 18+
- Automatic session, token, and scope management

---

## Table of Contents

- Quick Start
  - Connection Methods Overview
- Configuration
- Connect Flows
  - Backend-only (server handles code→token exchange)
- Scopes
- React Hook
- API Reference (essentials)
  - Authentication
  - Session
  - Tokens & Grants
  - Events
- Advanced (Logging, Storage)
- Troubleshooting
- Example App
- Tech Specs & License
- Concepts
- Multi-account
- Security Best Practices
- FAQ

---

## Quick Start

Prerequisites:

- Node 18+ and a modern browser
- A Nylas application with `redirectUri` configured in the Dashboard
- A reachable callback route/page in your app (e.g., `/auth/callback`)

### Connection Methods Overview

**Popup Flow** (Recommended):

- Opens OAuth in a popup window
- User authenticates without leaving your app
- Popup automatically closes after authentication
- Best for single-page applications (SPAs)
- Requires popup blockers to be disabled

**Inline Flow** (Redirect):

- Redirects the entire browser window to OAuth provider
- User authenticates and returns to your app via redirect
- Better for mobile browsers or when popups are problematic
- Full-page redirect flow

**Callback Route**:

- A dedicated route/page in your app (e.g., `/auth/callback`)
- Handles the OAuth response from the provider
- Must match the `redirectUri` configured in Nylas Dashboard
- Same callback works for both popup and inline flows
- Should call `nylasConnect.callback()` to complete the connection

Notes:

- Popup resolves to a `ConnectResult` or throws on error.
- Inline returns a URL `string` which you must navigate to (e.g., `window.location.href = url`).
  - After setting `window.location.href`, return early to avoid running further code in that handler.

Install:

```bash
npm install @nylas/connect
# or: pnpm add @nylas/connect | yarn add @nylas/connect
```

Environment (recommended):

```env
NYLAS_CLIENT_ID=your-nylas-client-id
NYLAS_REDIRECT_URI=http://localhost:3000/auth/callback
```

Notes:

- With modern bundlers, client-side env vars must be prefixed to be exposed:
  - Vite: `VITE_`
  - Create React App: `REACT_APP_`
  - Next.js (client): `NEXT_PUBLIC_`
- `NYLAS_CLIENT_ID` is safe to expose in the browser. Keep your API Key and Client Secret strictly on the server.
- `redirectUri` must exactly match what you configure in the Nylas Dashboard.

Initialize and connect (popup recommended):

```ts
import { NylasConnect } from "@nylas/connect";

const nylasConnect = new NylasConnect(); // picks up env vars

// Nylas handles default scopes automatically
const result = await nylasConnect.connect({ method: "popup" });

// Use grantId later (e.g., for logout or session reads)
const { grantId } = result;
```

`ConnectResult` shape (essentials):

```ts
type ConnectResult = {
  grantId: string;
  email?: string;
  name?: string;
};
```

Inline (redirect) example:

```ts
const url = await nylasConnect.connect({ method: "inline" });
window.location.href = url;
// Important: return early after navigation in the same handler
// to avoid starting multiple flows inadvertently.
```

Callback (e.g., at `/auth/callback`):

```ts
import { NylasConnect } from "@nylas/connect";
const nylasConnect = new NylasConnect();
await nylasConnect.callback();
```

Callback checklist:

- The URL must match your Dashboard `redirectUri` exactly (protocol, host, port, path)
- For popup flow, the callback can be a minimal HTML file under the same origin
- For inline flow, make this a route in your app that calls `callback()`
- If using client-side routing, ensure the route is reachable at the same origin path

Read the session after connecting:

```ts
const session = await nylasConnect.getSession(); // local read; does not call the network
if (session?.grantInfo) {
  console.log(
    "Connected as:",
    session.grantInfo.email || session.grantInfo.name,
  );
}
```

Minimal HTML callback (for popup):

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Nylas Callback</title>
  </head>
  <body>
    <script type="module">
      import { NylasConnect } from "@nylas/connect";
      new NylasConnect().callback();
    </script>
  </body>
</html>
```

---

## Configuration

| Option        | Type                                    | Default               | Description                                                                                  |
| ------------- | --------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| clientId      | string                                  | -                     | Nylas Client ID (can use `NYLAS_CLIENT_ID`).                                                 |
| redirectUri   | string                                  | -                     | OAuth redirect URI (can use `NYLAS_REDIRECT_URI`). Must match your Dashboard config.         |
| apiUrl        | string                                  | https://api.nylas.com | Region-specific API base URL (e.g., `https://api.us.nylas.com`, `https://api.eu.nylas.com`). |
| environment   | "development"\|"staging"\|"production"  | auto-detect           | Controls debug defaults; localhost typically maps to development.                            |
| persistTokens | boolean                                 | true                  | Persist tokens and grant info in localStorage (browser). Set `false` for memory-only.        |
| debug         | boolean                                 | true on localhost     | Simple on/off logging. Overrides `logLevel` when enabled.                                    |
| logLevel      | "error"\|"warn"\|"info"\|"debug"\|"off" | -                     | Verbosity of logs when debugging; set to `off` to disable.                                   |

Defaults: env vars and localhost are auto-detected; you can override via constructor.

Examples:

```ts
// Persist across reloads (default)
new NylasConnect({ persistTokens: true });

// Memory-only (no persistence)
new NylasConnect({ persistTokens: false });

// Use EU region API URL
new NylasConnect({ apiUrl: "https://api.eu.nylas.com" });
```

Example: passing env vars from Vite (client):

```ts
new NylasConnect({
  clientId: import.meta.env.VITE_NYLAS_CLIENT_ID,
  redirectUri: import.meta.env.VITE_NYLAS_REDIRECT_URI,
});
```

---

## Connect Flows

Popup (recommended):

```ts
await nylasConnect.connect({ method: "popup" });
```

Redirect (inline):

```ts
const url = await nylasConnect.connect({ method: "inline" });
window.location.href = url;
```

Use the same `callback()` for both flows.

Notes:

- `connect({ method: "popup" })` resolves to `ConnectResult` or throws on error.
- `connect({ method: "inline" })` resolves to a URL `string` which you should navigate to.
- `callback(url?)` auto-detects the current URL if none is provided and should be called on your callback route.

Minimal error handling examples:

```ts
// Popup
try {
  await nylasConnect.connect({ method: "popup" });
} catch (error) {
  console.error("Popup connect failed", error);
}

// Inline
try {
  const url = await nylasConnect.connect({ method: "inline" });
  window.location.href = url;
} catch (error) {
  console.error("Inline connect init failed", error);
}
```

---

### Backend-only (server handles code→token exchange)

If you want your backend (confidential client) to perform the code→token exchange using your server credentials, build the auth URL without PKCE in the browser, then let your server handle the callback and exchange using the official Nylas Node SDK.

What is PKCE? A security enhancement for public clients (like browsers) so secrets aren’t required. In backend-only flows, your server safely uses the client secret, so PKCE isn’t needed in the browser.

Why choose backend-only:

- Keep Client Secret and API Key off the browser for stricter security.
- Centralized token storage and session management on your server.
- Aligns with confidential client best practices.

```ts
import { NylasConnect } from "@nylas/connect";

const nylasConnect = new NylasConnect();

// Build an authorization URL without PKCE (for backend exchange)
const { url, state } = await nylasConnect.getAuthUrl();

// Optionally send `state` to your backend to correlate the callback
// Then redirect the browser
window.location.href = url;
```

On your backend, use the Nylas Node.js SDK (package name: `nylas`) to exchange the `code` for a grant. Note: this is a different library than `@nylas/connect` (this package). Refer to the Node SDK docs for details: https://developer.nylas.com/docs/v3/sdks/node/

```ts
// Node/TS example (server)
import "dotenv/config";
import express from "express";
import Nylas from "nylas";

const app = express();

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY!, // e.g., "NYLAS_API_KEY"
  apiUri: process.env.NYLAS_API_URI!, // e.g., "https://api.us.nylas.com"
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code)
    return res.status(400).send("No authorization code returned from Nylas");

  try {
    const { grantId } = await nylas.auth.exchangeCodeForToken({
      clientId: process.env.NYLAS_CLIENT_ID!,
      clientSecret: process.env.NYLAS_CLIENT_SECRET!,
      code,
      redirectUri: process.env.NYLAS_REDIRECT_URI!,
    });

    // Keep tokens/grantId server-side; issue your own session to the browser
    res.status(200).send({ grantId });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Failed to exchange authorization code for token");
  }
});
```

Notes:

- You can omit scopes to let Nylas handle defaults, or pass explicit scopes.
- Ensure `redirect_uri` matches in both the authorize and token exchange requests.
- `apiUrl` in this package and `apiUri` in the Node SDK refer to the same concept (your region base URL).
- If you forward `state` to your backend, validate it on callback to mitigate CSRF.

Flow (numbered):

1. Browser builds authorization URL without PKCE using `getAuthUrl()` and redirects to the provider.
2. Provider redirects back to your server callback with an authorization `code`.
3. Server exchanges the `code` using your `clientId`, `clientSecret`, and `redirectUri` via the Nylas Node SDK.
4. Server stores credentials (e.g., by `grantId`) and issues its own session to the browser.

Important:

> Never expose your Client Secret or API Key in the browser.
>
> Ensure your `apiUrl`/`apiUri` matches your Nylas region (e.g., US vs EU).

---

## Scopes

- Recommended: let Nylas handle scopes automatically (no `scopes` needed).
- Override only if you need to request narrower or specific provider scopes.

What are scopes?

- Scopes define the permissions your app is requesting from the provider (principle of least privilege).

Override example:

```ts
await nylasConnect.connect({
  method: "popup",
  scopes: [
    // Google scopes must use full URIs
    "https://www.googleapis.com/auth/gmail.readonly",
  ],
});
```

Notes:

- Google scopes use `https://www.googleapis.com/auth/...`
- Microsoft scopes use `https://graph.microsoft.com/...`
- IMAP/iCloud do not use OAuth scopes via providers.

See the Nylas scopes documentation in the Developer Portal for details.

More examples:

```ts
// Microsoft Graph mail read-only
await nylasConnect.connect({
  method: "popup",
  scopes: ["https://graph.microsoft.com/Mail.Read"],
});

// Request minimal scopes for a narrow use-case
await nylasConnect.connect({
  method: "popup",
  scopes: ["https://www.googleapis.com/auth/gmail.labels"],
});
```

Note: Expanding scopes later may require users to re-consent.

---

## React Hook

Minimal usage:

```tsx
import { useNylasConnect, UseNylasConnectConfig } from "@nylas/react/connect";

const config: UseNylasConnectConfig = {
  clientId: "your-nylas-client-id",
  redirectUri: "http://localhost:3000/auth/callback",
};

function App() {
  const { isConnected, grant, connect, logout, isLoading, error } =
    useNylasConnect(config);
  if (isLoading) return null;
  if (error) return <div>Error: {error.message}</div>;
  return isConnected ? (
    <div>
      <p>Welcome, {grant?.name || grant?.email}</p>
      <button
        onClick={async () => {
          await logout();
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={async () => {
        try {
          await connect({ method: "popup" }); // call directly in a user gesture
        } catch (e) {
          console.error("Connect failed", e);
        }
      }}
    >
      Login
    </button>
  );
}
```

What it is:

- A thin React wrapper around the core `NylasConnect` client that manages state and lifecycle for you.

Customize config (scopes, logging):

```tsx
const { connect } = useNylasConnect({
  clientId: "your-nylas-client-id",
  redirectUri: "http://localhost:3000/auth/callback",
  // Let Nylas defaults apply unless you need specific scopes
  scopes: ["https://graph.microsoft.com/Mail.Read"],
  logLevel: "warn",
});
```

Access the underlying client for advanced usage:

```tsx
const { connectClient } = useNylasConnect(config);

useEffect(() => {
  (async () => {
    const session = await connectClient.getSession(); // local read; no network call
    console.log(session);
  })();
}, [connectClient]);
```

When to use:

- Use the hook in React SPAs for effortless state management.
- Use `new NylasConnect()` directly in non-React or server contexts.

Hook return values (essentials):

| Name        | Type                                     | Purpose                  |
| ----------- | ---------------------------------------- | ------------------------ |
| isConnected | boolean                                  | Current connection state |
| grant       | GrantInfo\|null                          | Current grant info       |
| isLoading   | boolean                                  | Loading state            |
| error       | Error\|null                              | Last error               |
| connect     | (opts) => Promise<ConnectResult\|string> | Start auth flow          |
| logout      | () => Promise<void>                      | Sign out                 |

Optional: `enableDebug`, `disableDebug`, `setLogLevel`, `logger`, `connectClient`.

---

## API Reference (essentials)

| Method                        | Returns                                                   | Description                              |
| ----------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| connect(options?)             | Promise<ConnectResult\|string>                            | Start OAuth2 flow (popup or inline)      |
| callback(url?)                | Promise<ConnectResult>                                    | Universal OAuth callback handler         |
| getAuthUrl(options?)          | Promise<{ url: string; state: string; scopes: string[] }> | Build auth URL for backend-only exchange |
| getSession(grantId?)          | Promise<SessionData\|null>                                | Get current session                      |
| getAccessToken(grantId?)      | Promise<string\|null>                                     | Get stored access token                  |
| getGrantInfo(grantId?)        | Promise<GrantInfo\|null>                                  | Get stored grant info                    |
| isConnected(grantId?)         | Promise<boolean>                                          | Is grant currently connected?            |
| getConnectionStatus(grantId?) | Promise<ConnectionStatus>                                 | Get connection status                    |
| logout(grantId?)              | Promise<void>                                             | Clear stored tokens and logout           |
| onConnectStateChange(cb)      | () => void                                                | Subscribe to connect state changes       |

Events and errors:

```ts
nylasConnect.onConnectStateChange((event, session, data) => {
  if (event === "CONNECT_SUCCESS") console.log("Connected", session);
});

try {
  await nylasConnect.connect();
} catch (e) {
  // e.g., ConfigError, OAuthError, NetworkError, TokenError, PopupError
}
```

Unsubscribe example:

```ts
const unsubscribe = nylasConnect.onConnectStateChange(
  (event, session, data) => {
    // ...
  },
);

// Later
unsubscribe();
```

Method groups and when to use:

### Authentication

- `connect(options?)`: Start OAuth2 flow. Popup resolves to `ConnectResult`; inline returns a URL to navigate to.
- `callback(url?)`: Handle the OAuth redirect/callback URL (auto-detects current URL if omitted).
- `getAuthUrl(options?)`: Build an authorization URL for backend-only exchange.

### Session

- `getSession(grantId?)`: Read the current session for a grant.
- `isConnected(grantId?)`: Check whether a grant is connected.
- `getConnectionStatus(grantId?)`: Inspect connection state.
- `logout(grantId?)`: Clear stored tokens and logout.

### Tokens & Grants

- `getAccessToken(grantId?)`: Read the stored access token, if available.
- `getGrantInfo(grantId?)`: Read grant metadata (e.g., name, email).

### Events

- `onConnectStateChange(cb)`: Listen for connect state changes; returns an unsubscribe function.

Common errors:

| Error        | Typical cause                                                            |
| ------------ | ------------------------------------------------------------------------ |
| ConfigError  | Missing/invalid `clientId` or `redirectUri` (env not exposed to client). |
| OAuthError   | Authorization failed or denied by the provider.                          |
| NetworkError | Connectivity or CORS issues.                                             |
| TokenError   | Token exchange/refresh issues.                                           |
| PopupError   | Popup blocked or closed prematurely.                                     |

---

## Advanced

<details>
<summary>Logging</summary>

```ts
nylasConnect.enableDebug();
nylasConnect.disableDebug();
nylasConnect.setLogLevel("warn");
```

Also supported via `NYLAS_CONNECT_DEBUG` env, localStorage, or `?debug=true`.

`logLevel` values: `error`, `warn`, `info`, `debug`, `off`.

</details>

<details>
<summary>Storage</summary>

```ts
// Persist across reloads (default)
new NylasConnect({ persistTokens: true });

// Memory-only (no persistence)
new NylasConnect({ persistTokens: false });
```

Behavior: persistent survives reloads; memory-only clears on refresh.

Where data lives:

- Persistent mode: tokens and grant info stored in `localStorage`.
- Memory-only mode: stored in-memory; cleared on page refresh.

Notes:

- Persistent storage is scoped per browser origin (protocol + host + port).
- In memory-only mode, a page refresh signs the user out.

</details>

---

## Troubleshooting

Symptom → Cause → Fix

- Popup blocked → Browser blocked popups → Call `connect()` from a direct user click; allow popups; check for `PopupError`.
- No env vars in browser → Bundler not exposing env → Prefix with `VITE_`/`REACT_APP_`/`NEXT_PUBLIC_`.
- Session not persisting → Memory-only mode or blocked storage → Set `persistTokens: true`; allow localStorage.
- Redirect mismatch → `redirectUri` differs from Dashboard config → Ensure exact match including protocol/port/path.
- Region errors/CORS → Wrong `apiUrl` vs account region → Use correct region base URL (US/EU) and allow domain in Dashboard.
- Token expired → Session stale → Re-auth or refresh; check `isConnected()` and handle expiration.
- Inline flow not navigating → Ensure you return early after setting `window.location.href`.
- Connect called outside a user gesture → Browsers may block popups; call directly in a click/tap handler (avoid extra awaits first).

---

## Example App

- Location: `apps/nylas-connect-app`
- Run: `pnpm -w --filter nylas-connect-app dev` (workspace scripts)
- Shows: minimal connect (popup) and callback wiring

Setup notes:

- Set `NYLAS_CLIENT_ID` and `NYLAS_REDIRECT_URI` in your app env (with proper bundler prefix).
- Callback file/location: `apps/nylas-connect-app/public/auth/callback.html`.
- For Vite, create `apps/nylas-connect-app/.env` containing:

```env
VITE_NYLAS_CLIENT_ID=your-nylas-client-id
VITE_NYLAS_REDIRECT_URI=http://localhost:3000/auth/callback
```

---

## Tech Specs & License

- ESM-only module format (no CommonJS)
- TypeScript, Vite, Vitest, happy-dom
- Zero runtime dependencies

Browser support: modern evergreen browsers. Node runtime: 18+.

License: MIT

---

## Concepts

- Grant: The authorization your app has for a user account.
- Grant ID: An identifier for a specific grant (useful for multi-account apps).
- Session: Locally stored state representing a connected grant.
- Access Token: Credential used to access APIs on behalf of a grant.

## Multi-account

When handling multiple accounts, pass a `grantId` to target a specific connection:

```ts
const isPrimaryConnected = await nylasConnect.isConnected(primaryGrantId);
const token = await nylasConnect.getAccessToken(secondaryGrantId);
await nylasConnect.logout(primaryGrantId);
```

Getting a `grantId` from `connect()`:

```ts
const result = await nylasConnect.connect({ method: "popup" });
const { grantId } = result;
// Later, you can target this grant explicitly
await nylasConnect.logout(grantId);
```

## Security Best Practices

- Never expose your Client Secret or API Key in the browser.
- Prefer backend-only exchange for sensitive applications.
- Request only the minimal scopes required.
- Ensure `redirectUri` and region (`apiUrl`) are correctly configured.

## FAQ

- Popup keeps closing immediately
  - Likely popup blocked or closed; ensure call happens from a user action.
- Getting redirect mismatch errors
  - Verify `redirectUri` exactly matches your Dashboard config.
- Do I need to pass scopes?
  - Usually no; letting Nylas handle defaults is recommended. Override only when necessary.
- Which region should I use?
  - Match your account’s region: `https://api.us.nylas.com` or `https://api.eu.nylas.com`.
- What happens if the user cancels?
  - The flow rejects with `OAuthError`; catch and surface a friendly message.


---

## React Component: NylasConnectButton

A ready-made React button that wraps the same `@nylas/connect` flows under the hood. It handles popup vs inline, redirects for inline, and exposes callbacks for success, error, and cancel. Styling is included by default and can be customized or disabled.

Install (in addition to `@nylas/connect`):

```bash
npm install @nylas/react
# or: pnpm add @nylas/react | yarn add @nylas/react
```

Minimal quick start (popup recommended):

```tsx
import { NylasConnectButton } from "@nylas/react/connect";

export function ConnectCTA() {
  return (
    <NylasConnectButton
      clientId={import.meta.env.VITE_NYLAS_CLIENT_ID}
      redirectUri={import.meta.env.VITE_NYLAS_REDIRECT_URI}
      method="popup"
      text="Connect your inbox"
    />
  );
}
```

Notes:

- Nylas handles default OAuth scopes automatically; only pass `scopes` when you must override.
- Vite dev: styles are not auto-loaded from the `@nylas/react/connect` subpath. Import once in your app entry:

```ts
// e.g., src/main.tsx
import "@nylas/react/lib/connect/NylasConnectButton.css";
```

More robust example (all the knobs):

```tsx
import { NylasConnectButton } from "@nylas/react/connect";

export function AdvancedConnect() {
  return (
    <NylasConnectButton
      // Required config
      clientId={import.meta.env.VITE_NYLAS_CLIENT_ID}
      redirectUri={import.meta.env.VITE_NYLAS_REDIRECT_URI}

      // Optional environment/behavior
      apiUrl={import.meta.env.VITE_NYLAS_API_URL /* e.g., https://api.eu.nylas.com */}
      persistTokens={true}

      // Flow options
      method="popup" // or "inline"
      provider="microsoft" // or "google", etc. (optional)
      // Only specify scopes when you need to override defaults
      scopes={["https://graph.microsoft.com/Mail.Read"]}
      loginHint="user@company.com"
      popupWidth={520}
      popupHeight={640}

      // Styling
      variant="primary" // or "outline"
      size="md" // "sm" | "md" | "lg"
      // Set CSS custom properties (optional)
      cssVars={{
        "--nylas-btn-bg": "#111827",
        "--nylas-btn-fg": "#ffffff",
        "--nylas-btn-border": "#111827",
        "--nylas-btn-bg-hover": "#1f2937",
      }}
      // Or opt-out of built-in styles entirely
      // unstyled

      // Callbacks
      onStart={() => console.log("Starting connect…")}
      onSuccess={(result) => console.log("Connected:", result)}
      onError={(error) => console.error("Connect error:", error)}
      onCancel={(reason) => console.log("User cancelled:", reason)}
    >
      Connect with Microsoft
    </NylasConnectButton>
  );
}
```

Styling tips:

- The button ships with accessible, theme-aware defaults. You can scope themes via a parent `.nylas-theme-light` / `.nylas-theme-dark` class or a `[data-theme]` attribute.
- Use `cssVars` to tweak colors without writing CSS, or set `unstyled` to supply your own classes/styles.
