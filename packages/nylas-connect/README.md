<div align="center">
  <a href="https://www.nylas.com/">
    <img width="100%" alt="Nylas" src="https://github.com/user-attachments/assets/137517ae-244d-47a5-8ca7-b12984971fc4" />
  </a>

  <h1>Nylas Connect for JavaScript</h1>

  <p>
    <strong>Connect a user's mailbox to your app without building the OAuth flow</strong>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@nylas/connect"><img src="https://img.shields.io/npm/v/@nylas/connect" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@nylas/connect"><img src="https://img.shields.io/npm/dm/@nylas/connect" alt="downloads" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" /></a>
    <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license" /></a>
  </p>

  <p>
    <a href="https://developer.nylas.com/docs/v3/auth/nylas-connect/">📖 Library guide</a> ·
    <a href="https://developer.nylas.com/docs/api/v3/">📚 API Reference</a> ·
    <a href="https://dashboard-v3.nylas.com/register">🚀 Sign up</a> ·
    <a href="https://github.com/orgs/nylas-samples/repositories">💡 Samples</a> ·
    <a href="https://forums.nylas.com">💬 Forum</a>
  </p>
</div>

<br />

`@nylas/connect` runs the OAuth flow that connects a user's mailbox to your app, so you don't write a redirect route, a callback handler, a code-for-token exchange, or refresh logic. Paired with your identity provider, it also lets you keep addressing that user by the ID your app already has, instead of storing a Nylas grant ID alongside it. Works across Gmail, Microsoft, IMAP, iCloud, and the other providers behind [Nylas](https://developer.nylas.com/docs/v3/).

This repository is for contributors and anyone installing from source. If you just want to use the library in your app, head straight to the [**library guide**](https://developer.nylas.com/docs/v3/auth/nylas-connect/) on developer.nylas.com.

## Get started

1. [Sign up for a free Nylas account](https://dashboard-v3.nylas.com/register) and grab your client ID from the [Nylas Dashboard](https://dashboard-v3.nylas.com/).
2. Register your app's origin and callback URI under **Hosted Authentication**, so the browser flow is allowed to run.
3. Install the package and connect your first mailbox — see below.

The [quickstart](https://developer.nylas.com/docs/v3/getting-started/nylas-connect/) walks through a working setup end to end, including which of the 3 configurations fits your app.

## ⚙️ Install

> **Requirements:** a modern browser, or Node.js 22+. Zero runtime dependencies.

```bash
npm install @nylas/connect
# or
pnpm add @nylas/connect
```

The package ships its own TypeScript types. It's ESM-only.

React apps should install [`@nylas/react`](https://www.npmjs.com/package/@nylas/react) instead, which wraps this client in a `useNylasConnect` hook and a `NylasConnectButton` component.

To install from source:

```bash
git clone https://github.com/nylas/javascript.git
cd javascript
pnpm install
```

### Runtime support

Runs in modern browsers and in Node.js 22+. The popup flow needs a browser, since it drives a popup window and reads `localStorage`; the redirect flow and `callback(url)` both work server-side.

The library calls Web Crypto (`crypto.subtle`), `fetch`, and `btoa`/`atob` as globals, with no polyfill and no `node:` imports — which is why Node 22 is the floor rather than 18.

## ⚡️ Usage

You drive everything through an instance of `NylasConnect`. Initialize it with your client ID and the URI Nylas redirects back to — both fall back to `NYLAS_CLIENT_ID` and `NYLAS_REDIRECT_URI`, so `new NylasConnect()` with no arguments works once those are set.

```typescript
import { NylasConnect } from "@nylas/connect";

const nylasConnect = new NylasConnect({
  clientId: process.env.NYLAS_CLIENT_ID,
  redirectUri: "http://localhost:3000/auth/callback",
  apiUrl: "https://api.us.nylas.com", // or https://api.eu.nylas.com
});
```

Bundlers need their own prefix: `VITE_NYLAS_CLIENT_ID` for Vite, `NEXT_PUBLIC_NYLAS_CLIENT_ID` for Next.js.

Once initialized, connect a mailbox and read from it:

```typescript
// Opens a popup, completes the PKCE exchange, stores the tokens.
const result = await nylasConnect.connect({ method: "popup" });
console.log("Connected:", result.grantInfo?.email);

// Authorize with the returned access token and address the mailbox as `me`.
const res = await fetch("https://api.us.nylas.com/v3/grants/me/messages?limit=5", {
  headers: { Authorization: `Bearer ${result.accessToken}` },
});
```

The mailbox address is on `result.grantInfo`, not on `result` itself.

This runs entirely in the browser, so it authorizes with the `accessToken` that `connect()` returns — never an API key, which would be inlined into your bundle. An access token covers grant-level data like the request above; application-level requests still need an API key, and those belong on your server.

### Connection methods

```typescript
// Popup: user stays on your page. Best for SPAs.
const result = await nylasConnect.connect({ method: "popup" });

// Inline: full-page redirect. Better for mobile, works when popups are blocked.
const url = await nylasConnect.connect({ method: "inline" });
window.location.href = url;

// At your redirectUri, complete the exchange.
await nylasConnect.callback();
```

`provider` accepts `google`, `microsoft`, `imap`, and `icloud`. Omit it and the user picks their own from the Nylas login screen.

### Keep your own user IDs

Pass `identityProviderToken` and the grant is linked to the `sub` claim in your identity provider's JWT. You then address the mailbox as `/v3/grants/me` with your own user ID in a header, so there's no `grant_id` column and no join table.

```typescript
const nylasConnect = new NylasConnect({
  clientId: process.env.NYLAS_CLIENT_ID,
  redirectUri: "http://localhost:3000/auth/callback",
  identityProviderToken: async () => auth0.getTokenSilently(),
});

await nylasConnect.connect({ method: "popup" });

// The same user ID your app already uses, everywhere.
const res = await fetch("https://api.us.nylas.com/v3/grants/me/messages", {
  headers: {
    Authorization: `Bearer ${await auth0.getTokenSilently()}`,
    "X-Nylas-External-User-Id": user.sub,
  },
});
```

The callback runs during the token exchange and the JWT is sent to Nylas as `idp_claims`. Return a fresh token each time; most identity provider SDKs refresh for you. Returning `null` continues without claims, and throwing fails the exchange with a `NETWORK_ERROR` event.

Works with Auth0, Clerk, Google Identity, WorkOS, and any provider exposing a JSON Web Key Set endpoint. Setup guides for each: [external identity providers](https://developer.nylas.com/docs/v3/auth/nylas-connect/use-external-idp/).

Without an identity provider you still skip the OAuth plumbing, but you store the grant ID yourself. See [backend callback handling](https://developer.nylas.com/docs/v3/auth/nylas-connect/backend-oauth/).

### Sessions

```typescript
const session = await nylasConnect.getSession();
if (session?.grantInfo) console.log(session.grantInfo.email);

// "connected" | "expired" | "invalid" | "not_connected"
const status = await nylasConnect.getConnectionStatus();

await nylasConnect.logout(); // or logout(grantId) for one of several
```

Call `getSession()` on load to restore a session. It returns `null` when nobody is connected, which is your cue to show a connect button.

### Configuration

| Option                  | Type                               | Default                    | Description                                                     |
| ----------------------- | ---------------------------------- | -------------------------- | --------------------------------------------------------------- |
| `clientId`              | `string`                           | `NYLAS_CLIENT_ID`          | Your Nylas application's client ID                              |
| `redirectUri`           | `string`                           | `NYLAS_REDIRECT_URI`       | Where Nylas returns the user after they authorize               |
| `apiUrl`                | `string`                           | `https://api.us.nylas.com` | Use `https://api.eu.nylas.com` for EU accounts                  |
| `environment`           | `Environment`                      | detected automatically     | `development`, `staging`, or `production`                       |
| `defaultScopes`         | `NylasScope[]` \| `ProviderScopes` | connector scopes           | Scopes to request, optionally keyed per provider                |
| `persistTokens`         | `boolean`                          | `true`                     | Store tokens in `localStorage`; `false` keeps them in memory    |
| `autoHandleCallback`    | `boolean`                          | `true`                     | Let the browser exchange the code; `false` for backend handling |
| `debug`                 | `boolean`                          | on in development          | Enable debug logging                                            |
| `logLevel`              | `LogLevel` \| `"off"`              | follows `debug`            | `error`, `warn`, `info`, `debug`, or `off`                      |
| `codeExchange`          | `CodeExchangeMethod`               | built-in PKCE exchange     | Replace the token exchange with your own                        |
| `identityProviderToken` | `IdentityProviderTokenCallback`    | none                       | Returns your IdP's JWT, sent to Nylas as `idp_claims`           |

### Custom code exchange

Pass `codeExchange` to run the token exchange on your own backend, keeping your API key out of the browser. Your function receives the code and returns a `ConnectResult`.

```typescript
const nylasConnect = new NylasConnect({
  clientId: process.env.NYLAS_CLIENT_ID,
  redirectUri: "http://localhost:3000/auth/callback",
  codeExchange: async (params) => {
    const r = await fetch("/api/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const t = await r.json();
    return {
      accessToken: t.access_token,
      idToken: t.id_token,
      grantId: t.grant_id,
      expiresAt: Date.now() + t.expires_in * 1000,
      scope: t.scope,
      grantInfo: t.grant_info,
    };
  },
});
```

The matching backend route, plus the `state` handling that links a grant to your user, is in [backend callback handling](https://developer.nylas.com/docs/v3/auth/nylas-connect/backend-oauth/).

### Backend-only flow

To do the whole exchange server-side, `getAuthUrl()` builds the authorization URL **without** PKCE and without storing any state, leaving your backend to exchange the code as a confidential client using your API key.

```typescript
// Client: build the URL and send the user to it.
const { url, state, scopes } = await nylasConnect.getAuthUrl();
window.location.href = url;

// Server: exchange the code with the Nylas Node SDK.
const { grantId } = await nylas.auth.exchangeCodeForToken({
  clientId: process.env.NYLAS_CLIENT_ID,
  clientSecret: process.env.NYLAS_CLIENT_SECRET,
  code: req.query.code,
  redirectUri: process.env.NYLAS_REDIRECT_URI,
});
```

Persist the returned `state` and check it when the user comes back. Because nothing is stored client-side, `callback()` and `getSession()` play no part in this flow.

### Error handling

Every error extends `NylasConnectError` and sets a distinct `name`, so checking `error.name` always works. The 3 you'll handle most often:

```typescript
try {
  await nylasConnect.connect({ method: "popup" });
} catch (error) {
  if (error.name === "PopupError") {
    // Blocked or closed. Fall back to method: "inline".
  } else if (error.name === "ConfigError") {
    // Missing clientId or redirectUri.
  } else if (error.name === "OAuthError") {
    // Provider rejected the request.
  }
}
```

`OAuthError` is thrown as one of 9 subclasses mapping to the OAuth 2.0 error codes — `OAuthAccessDeniedError`, `OAuthInvalidGrantError`, `OAuthInvalidScopeError`, and so on. Those subclasses aren't exported, so narrow them with `error.name`; `instanceof OAuthError` catches all 9. The importable classes are `NylasConnectError`, `ConfigError`, `NetworkError`, `OAuthError`, `TokenError`, and `PopupError`.

You can also subscribe rather than catch:

```typescript
const unsubscribe = nylasConnect.onConnectStateChange((event, session, data) => {
  if (event === "CONNECT_SUCCESS") console.log(session?.grantInfo?.email);
  if (event === "CONNECT_ERROR") console.error(data?.error);
});
```

## 💡 Examples

A runnable demo lives at the package root — `index.html`, `callback.html`, and `auth-instance.js`. Start it with `pnpm dev`.

For full sample apps and product quickstarts, browse [**nylas-samples** on GitHub](https://github.com/orgs/nylas-samples/repositories).

## 🤖 AI agents

[nylas/skills](https://github.com/nylas/skills) drops Nylas into Claude Code, Cursor, Codex, and other agents that support the skills format:

```bash
npx skills add nylas/skills
/plugin marketplace add nylas/skills   # Claude Code
```

The CLI also installs an MCP server for Claude Desktop, Claude Code, Cursor, Windsurf, or VS Code:

```bash
brew install nylas/nylas-cli/nylas
nylas mcp install
```

Walkthrough: [give AI agents email access via MCP](https://cli.nylas.com/guides/give-ai-agents-email-access-via-mcp).

## 📚 Reference

- **Library guide:** [developer.nylas.com/docs/v3/auth/nylas-connect](https://developer.nylas.com/docs/v3/auth/nylas-connect/)
- **Quickstart:** [developer.nylas.com/docs/v3/getting-started/nylas-connect](https://developer.nylas.com/docs/v3/getting-started/nylas-connect/)
- **`NylasConnect` class reference:** [every method signature and return type](https://developer.nylas.com/docs/v3/auth/nylas-connect/nylasconnect-class/)
- **Identity provider guides:** [Auth0, Clerk, Google, WorkOS, custom JWKS](https://developer.nylas.com/docs/v3/auth/nylas-connect/use-external-idp/)
- **API reference:** [developer.nylas.com/docs/api/v3](https://developer.nylas.com/docs/api/v3/)
- **Auth flows:** [developer.nylas.com/docs/v3/auth](https://developer.nylas.com/docs/v3/auth/)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

## ✨ Upgrading

See [`CHANGELOG.md`](CHANGELOG.md) for per-release notes.

## 💙 Contributing

Issues, ideas, and pull requests welcome — see [CONTRIBUTING.md](../../CONTRIBUTING.md). Before opening a large change, please open an issue or post in the [forum](https://forums.nylas.com) so we can sanity-check the direction.

## 🔒 Security

Found a vulnerability? Please **don't** open a public issue. Report it through our [Vulnerability Disclosure Policy](https://www.nylas.com/security/vulnerability-disclosure-policy/).

## 🔗 Other Nylas SDKs

- [@nylas/react](https://github.com/nylas/javascript/tree/main/packages/react) · `npm install @nylas/react`
- [nylas-nodejs](https://github.com/nylas/nylas-nodejs) · `npm install nylas`
- [nylas-python](https://github.com/nylas/nylas-python) · `pip install nylas`
- [nylas-ruby](https://github.com/nylas/nylas-ruby) · `gem install nylas`
- [nylas-java](https://github.com/nylas/nylas-java) · Maven / Gradle (Kotlin too)

## 📝 License

MIT — see [LICENSE.md](LICENSE.md).
