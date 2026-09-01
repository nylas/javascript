<div align="center">
  <a href="https://www.nylas.com/">
    <img width="100%" alt="Nylas" src="https://github.com/user-attachments/assets/137517ae-244d-47a5-8ca7-b12984971fc4" />
  </a>

  <h1>Nylas React Components</h1>

  <p>
    <strong>Scheduler components and OAuth connection hooks for React</strong>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@nylas/react"><img src="https://img.shields.io/npm/v/@nylas/react" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@nylas/react"><img src="https://img.shields.io/npm/dm/@nylas/react" alt="downloads" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript" /></a>
    <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license" /></a>
  </p>

  <p>
    <a href="https://developer.nylas.com/docs/v3/scheduler/">📖 Scheduler guide</a> ·
    <a href="https://developer.nylas.com/docs/api/v3/scheduler/">📚 API Reference</a> ·
    <a href="https://dashboard-v3.nylas.com/register">🚀 Sign up</a> ·
    <a href="https://github.com/orgs/nylas-samples/repositories">💡 Samples</a> ·
    <a href="https://forums.nylas.com">💬 Forum</a>
  </p>
</div>

<br />

`@nylas/react` gives you Nylas Scheduler as React components, so you can drop a booking page or a full scheduling-page editor into your app instead of building availability logic, timezone handling, and booking forms yourself. It also ships a `useNylasConnect` hook and a `NylasConnectButton` for the OAuth flow that connects a user's calendar.

This repository is for contributors and anyone installing from source. If you just want to use the library in your app, head to the [**Scheduler guide**](https://developer.nylas.com/docs/v3/scheduler/) on developer.nylas.com.

## Get started

1. [Sign up for a free Nylas account](https://dashboard-v3.nylas.com/register) and grab your client ID from the [Nylas Dashboard](https://dashboard-v3.nylas.com/).
2. Register your app's callback URI under **Hosted Authentication**, so the connection flow is allowed to run.
3. Install the package and render your first component — see below.

The [Scheduler quickstart](https://developer.nylas.com/docs/v3/getting-started/scheduler/) walks through a working setup end to end, with the finished code in [quickstart-scheduler-react](https://github.com/nylas-samples/quickstart-scheduler-react).

## ⚙️ Install

```bash
npm install @nylas/react@latest
# or
yarn add @nylas/react@latest
```

### Requirements

- [Node.js](https://nodejs.org/en/) v20 or higher
- [React](https://react.dev/) 18 or 19

The package ships its own TypeScript types, and exposes three subpaths so you only bundle what you use:

| Import from | Contains |
| --- | --- |
| `@nylas/react` | Everything below except the Connect symbols |
| `@nylas/react/elements` | Scheduler and booking components |
| `@nylas/react/utils` | `NylasIdentityRequestWrapper`, and the `LANGUAGE_CODE` type |
| `@nylas/react/connect` | `useNylasConnect`, `NylasConnectButton`, and re-exports of `@nylas/connect` |

> **Note:** `useNylasConnect` and `NylasConnectButton` are available **only** from `@nylas/react/connect`, not from the package root.

To install from source:

```bash
git clone https://github.com/nylas/javascript.git
cd javascript
pnpm install
```

## ⚡️ Usage

### Scheduler components

Three components are the entry points:

- **`NylasScheduling`** — the booking page your end users see.
- **`NylasSchedulerEditor`** — the editor where your users build and configure scheduling pages.
- **`NylasSchedulingMethod`** — picks a scheduling method.

Around 50 further components (`NylasAvailabilityPicker`, `NylasBookingForm`, `NylasBufferTime`, `NylasCancellationPolicy`, `NylasTimeslotPicker`, and so on) are exported as the building blocks those two compose, alongside `NylasNotetakerConfig` and a set of form primitives and icons. Most apps only need the entry points.

### Scheduler Editor

The following example adds the Nylas Scheduler Editor and Scheduling components to your React app.

> ⚠️ **Important:** Make sure to replace the `NYLAS_CLIENT_ID` with your Nylas Client ID. Your Nylas Client ID can be found in your app's Overview page on the [Nylas Dashboard](https://dashboard-v3.nylas.com).

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NylasSchedulerEditor, NylasScheduling } from "@nylas/react";

function App() {
  // Get the configuration ID from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const configId = urlParams.get("config_id") || "";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <a href="/scheduler-editor" className="button">
                View Scheduler Editor
              </a>
              <NylasScheduling
                configurationId={configId}
                schedulerApiUrl="https://api.us.nylas.com"
              />
            </div>
          }
        />
        <Route
          path="/scheduler-editor"
          element={
            <div>
              <NylasSchedulerEditor
                schedulerPreviewLink={`${window.location.origin}/?config_id=${config.id}`}
                nylasSessionsConfig={{
                  clientId: "NYLAS_CLIENT_ID", // Replace with your Nylas client ID from the previous
                  redirectUri: `${window.location.origin}/scheduler-editor`,
                  domain: "https://api.us.nylas.com/v3", // or 'https://api.eu.nylas.com/v3' for EU data center
                  hosted: true,
                  accessType: "offline",
                }}
                defaultSchedulerConfigState={{
                  selectedConfiguration: {
                    requires_session_auth: false, // Creates a public configuration which doesn't require a session
                    scheduler: {
                      // The callback URLs to be set in email notifications
                      rescheduling_url: `${window.location.origin}/reschedule/:booking_ref`, // The URL of the email notification includes the booking reference
                      cancellation_url: `${window.location.origin}/cancel/:booking_ref`,
                    },
                  },
                }}
              />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
```

### Local development server

To create a Scheduling Page from the Scheduler Editor, you'll need a working Scheduler UI. To do this, run a local server to host your Scheduler Editor and Scheduling Pages.

Navigate to the root directory of your project and run the following command.

```text
npm run dev -- --port <PORT>
```

After you run the command, open your browser to `http://localhost:<PORT>/scheduler-editor` to see your Scheduler Editor and create your first Scheduling Page.

### useNylasConnect hook

The `useNylasConnect` hook provides a simple way to add OAuth authentication to your React app using Nylas Connect.

```jsx
import { useNylasConnect } from "@nylas/react/connect";

function LoginButton() {
  const { isConnected, connect, logout, grant, isLoading } = useNylasConnect({
    clientId: "your-nylas-client-id",
    redirectUri: "http://localhost:3000/callback",
  });

  if (isLoading) return <div>Loading...</div>;

  if (isConnected) {
    return (
      <div>
        <p>Connected as: {grant?.email}</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => connect({ method: "popup" })}>Connect Account</button>
  );
}
```

#### Configuration

`UseNylasConnectConfig` extends `ConnectConfig` from [`@nylas/connect`](https://github.com/nylas/javascript/tree/main/packages/nylas-connect), so every option there — `apiUrl`, `defaultScopes`, `persistTokens`, `logLevel`, `codeExchange`, `identityProviderToken`, and the rest — is accepted here too. The most common, plus the four the hook adds of its own:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | `NYLAS_CLIENT_ID` | Your Nylas Client ID |
| `redirectUri` | `string` | `NYLAS_REDIRECT_URI` | OAuth callback URL |
| `autoHandleCallback` | `boolean` | `true` | Automatically handle the OAuth callback |
| `autoRefreshInterval` | `number` | disabled | Auto-refresh session interval, in ms |
| `initialLoadingState` | `boolean` | `true` | Loading state the hook mounts with |
| `retryAttempts` | `number` | `0` | Retry attempts for failed operations |
| `enableAutoRecovery` | `boolean` | `false` | Automatic recovery from network errors |

#### Return values

**State:**

- `isConnected` — whether the user is authenticated
- `grant` — the current user's `GrantInfo`, or `null`
- `isLoading` — loading state for operations
- `error` — current error, if any

**Actions:**

- `connect(options)` — start the OAuth flow
- `logout(grantId?)` — sign the user out
- `refreshSession()` — refresh the current session
- `subscribe(callback)` — listen to connection events
- `setLogLevel(level)` — change log verbosity at runtime

The underlying client is also returned as `connectClient`, for anything the hook doesn't wrap.

#### Environment setup

For security, use environment variables for your configuration:

```bash
# .env.local
VITE_NYLAS_CLIENT_ID=your-nylas-client-id
VITE_NYLAS_REDIRECT_URI=http://localhost:3000/callback
```

```jsx
const { isConnected, connect } = useNylasConnect({
  clientId: import.meta.env.VITE_NYLAS_CLIENT_ID,
  redirectUri: import.meta.env.VITE_NYLAS_REDIRECT_URI,
});
```

Next.js uses `NEXT_PUBLIC_` instead of `VITE_`.

### NylasConnectButton

The `NylasConnectButton` component provides a simple way to add email provider authentication to your React application.

```jsx
import { NylasConnectButton } from "@nylas/react/connect";

function App() {
  return (
    <NylasConnectButton
      clientId="your-nylas-client-id"
      redirectUri="http://localhost:3000/callback"
      onSuccess={(result) => {
        console.log("Connected successfully:", result);
      }}
      onError={(error) => {
        console.error("Connection failed:", error);
      }}
    />
  );
}
```

Beyond `clientId` and `redirectUri`, the props fall into four groups:

| Group | Props |
| --- | --- |
| Connection | `apiUrl`, `defaultScopes`, `persistTokens`, `method`, `provider`, `scopes`, `loginHint`, `popupWidth`, `popupHeight` |
| Appearance | `text`, `children`, `variant` (`primary` \| `outline`), `size` (`sm` \| `md` \| `lg`), `className`, `style`, `disabled`, `unstyled`, `cssVars` |
| Callbacks | `onStart`, `onSuccess`, `onError`, `onCancel` |
| Advanced | `identityProviderToken`, `codeExchange` |

`unstyled` drops the default styling entirely; `cssVars` re-themes it without doing so, accepting `--nylas-btn-bg`, `--nylas-btn-fg`, `--nylas-btn-border`, and `--nylas-btn-bg-hover`.

### External identity providers

For applications that use external identity providers (via JWKS), you can pass identity provider tokens during authentication:

```jsx
import { NylasConnectButton } from "@nylas/react/connect";

function App() {
  // Function to retrieve JWT token from your external identity provider
  const getIdpToken = async () => {
    // Get the JWT token from your authentication system
    const token = await yourAuthSystem.getJWT();
    return token; // or return null if not available
  };

  return (
    <NylasConnectButton
      clientId="your-nylas-client-id"
      redirectUri="http://localhost:3000/callback"
      identityProviderToken={getIdpToken}
      onSuccess={(result) => {
        console.log("Connected with IDP claims:", result);
      }}
      onError={(error) => {
        console.error("Connection failed:", error);
      }}
    />
  );
}
```

Returning `null` continues without IDP claims; throwing fails authentication. Per-provider setup guides for Auth0, Clerk, Google, and WorkOS: [external identity providers](https://developer.nylas.com/docs/v3/auth/nylas-connect-react/use-external-idp/).

### Custom code exchange

For enhanced security, you can handle the OAuth code exchange on your backend:

```jsx
import { NylasConnectButton } from "@nylas/react/connect";

function App() {
  const handleCodeExchange = async (params) => {
    // Send the authorization code to your backend
    const response = await fetch("/api/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  };

  return (
    <NylasConnectButton
      clientId="your-nylas-client-id"
      redirectUri="http://localhost:3000/callback"
      codeExchange={handleCodeExchange}
      onSuccess={(result) => {
        console.log("Connected successfully:", result);
      }}
      onError={(error) => {
        console.error("Connection failed:", error);
      }}
    />
  );
}
```

### Error handling

The hook surfaces failures on `error` rather than throwing, so render from it directly. `NylasConnectButton` reports them through `onError`, and `onCancel` fires separately when the user closes the popup.

```jsx
const { error, connect } = useNylasConnect({ clientId, redirectUri });

if (error) return <p role="alert">Couldn't connect: {error.message}</p>;
```

Every error extends `NylasConnectError` and sets a distinct `name` — `PopupError` for a blocked or closed popup, `ConfigError` for a missing `clientId`, `OAuthError` when the provider rejects the request. All of them are re-exported from `@nylas/react/connect`.

## 💡 Examples

- [quickstart-scheduler-react](https://github.com/nylas-samples/quickstart-scheduler-react) — the finished code for the Scheduler quickstart.
- [nylas-samples](https://github.com/orgs/nylas-samples/repositories) — full sample apps and product quickstarts.

## 🤖 AI agents

[nylas/skills](https://github.com/nylas/skills) drops Nylas into Claude Code, Cursor, Codex, and other agents that support the skills format:

```bash
npx skills add nylas/skills
/plugin marketplace add nylas/skills   # Claude Code
```

## 📚 Reference

- **Scheduler guide:** [developer.nylas.com/docs/v3/scheduler](https://developer.nylas.com/docs/v3/scheduler/)
- **Scheduler quickstart:** [developer.nylas.com/docs/v3/getting-started/scheduler](https://developer.nylas.com/docs/v3/getting-started/scheduler/)
- **Scheduler API reference:** [developer.nylas.com/docs/api/v3/scheduler](https://developer.nylas.com/docs/api/v3/scheduler/)
- **React connect guide:** [developer.nylas.com/docs/v3/auth/nylas-connect-react](https://developer.nylas.com/docs/v3/auth/nylas-connect-react/)
- **`useNylasConnect` reference:** [every option and return value](https://developer.nylas.com/docs/v3/auth/nylas-connect-react/usenylasconnect/)
- **`NylasConnectButton` reference:** [every prop](https://developer.nylas.com/docs/v3/auth/nylas-connect-react/nylasconnectbutton/)
- **Identity provider guides:** [Auth0, Clerk, Google, WorkOS](https://developer.nylas.com/docs/v3/auth/nylas-connect-react/use-external-idp/)
- **Developer forum:** [forums.nylas.com](https://forums.nylas.com/)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

## ✨ Upgrading

See [`CHANGELOG.md`](CHANGELOG.md) for per-release notes.

## 💙 Contributing

Issues, ideas, and pull requests welcome — see [CONTRIBUTING.md](../../CONTRIBUTING.md). Before opening a large change, please open an issue or post in the [forum](https://forums.nylas.com) so we can sanity-check the direction.

## 🔒 Security

Found a vulnerability? Please **don't** open a public issue. Report it through our [Vulnerability Disclosure Policy](https://www.nylas.com/security/vulnerability-disclosure-policy/).

## 🔗 Other Nylas SDKs

- [@nylas/connect](https://github.com/nylas/javascript/tree/main/packages/nylas-connect) · `npm install @nylas/connect`
- [nylas-nodejs](https://github.com/nylas/nylas-nodejs) · `npm install nylas`
- [nylas-python](https://github.com/nylas/nylas-python) · `pip install nylas`
- [nylas-ruby](https://github.com/nylas/nylas-ruby) · `gem install nylas`
- [nylas-java](https://github.com/nylas/nylas-java) · Maven / Gradle (Kotlin too)

## 📝 License

MIT — see [LICENSE.md](LICENSE.md).
