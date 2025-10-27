# Nylas React Components

React components for Nylas Scheduler

![npm](https://img.shields.io/npm/v/@nylas/react)

## Requirements

- [Node.js](https://nodejs.org/en/) v20 or higher
- [React.js](https://react.dev/) v18 or higher

## Compatibility Notice

## Installation

Install Nylas React Components via npm:

```bash
npm install @nylas/react@latest
```

or yarn

```bash
  yarn add @nylas/react@latest
```

## Getting Started

The following example adds the Nylas Scheduler Editor and Scheduling components to your React app.

> ⚠️ **Important:** Make sure to replace the `NYLAS_CLIENT_ID` with your Nylas Client ID. Your Nylas Client ID can be found in your app's Overview page on the [Nylas Dashboard](https://dashboard-v3.nylas.com).

### Adding the Components

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
                schedulerPreviewLink={`${window.location.origin}/?config_id={config.id}`}
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

### Start a local development server

To create a Scheduling Page from the Scheduler Editor, you'll need a working Scheduler UI. To do this, run a local server to host your Scheduler Editor and Scheduling Pages.

Navigate the root directory of your project and run the following command.

```text
npm run dev -- --port <PORT>
```

After you run the command, open your browser to `http://localhost:<PORT>/scheduler-editor` to see your Scheduler Editor and create your first Scheduling Page.


## Nylas Connect Hook

The `useNylasConnect` hook provides a simple way to add OAuth authentication to your React app using Nylas Connect.

### Basic Usage

```jsx
import { useNylasConnect } from '@nylas/react';

function LoginButton() {
  const { isConnected, connect, logout, grant, isLoading } = useNylasConnect({
    clientId: 'your-nylas-client-id',
    redirectUri: 'http://localhost:3000/callback'
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
    <button onClick={() => connect({ method: 'popup' })}>
      Connect Account
    </button>
  );
}
```


### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clientId` | `string` | - | Your Nylas Client ID |
| `redirectUri` | `string` | - | OAuth callback URL |
| `autoHandleCallback` | `boolean` | `true` | Automatically handle OAuth callback |
| `autoRefreshInterval` | `number` | - | Auto-refresh session interval (ms) |
| `retryAttempts` | `number` | `0` | Number of retry attempts for failed operations |
| `enableAutoRecovery` | `boolean` | `false` | Enable automatic error recovery |

### Hook Return Values

The hook returns an object with the following properties:

**State:**
- `isConnected` - Whether user is authenticated
- `grant` - Current user's grant information
- `isLoading` - Loading state for operations
- `error` - Current error, if any

**Actions:**
- `connect(options)` - Start OAuth flow
- `logout(grantId?)` - Sign out user
- `refreshSession()` - Refresh current session
- `subscribe(callback)` - Listen to connection events

### Environment Setup

For security, use environment variables for your configuration:

```bash
# .env.local
VITE_NYLAS_CLIENT_ID=your-nylas-client-id
VITE_NYLAS_REDIRECT_URI=http://localhost:3000/callback
```

```jsx
const { isConnected, connect } = useNylasConnect({
  clientId: import.meta.env.VITE_NYLAS_CLIENT_ID,
  redirectUri: import.meta.env.VITE_NYLAS_REDIRECT_URI
});
```





## Nylas Connect Button

The `NylasConnectButton` component provides a simple way to add email provider authentication to your React application.

### Basic Usage

```jsx
import { NylasConnectButton } from "@nylas/react";

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

### External Identity Provider Integration

For applications that use external identity providers (via JWKS), you can pass identity provider tokens during authentication:

```jsx
import { NylasConnectButton } from "@nylas/react";

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

### Custom Backend Code Exchange

For enhanced security, you can handle the OAuth code exchange on your backend:

```jsx
import { NylasConnectButton } from "@nylas/react";

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

## Links

For a complete walkthrough on setting up Scheduler can be found at [https://developer.nylas.com/docs/v3/getting-started/scheduler/](https://developer.nylas.com/docs/v3/getting-started/scheduler/), with the complete code available on [GitHub](https://github.com/nylas-samples/quickstart-scheduler-react).

### Further reading:

- [Scheduler documentation](https://developer.nylas.com/docs/v3/scheduler/)
- [Scheduler API reference](https://developer.nylas.com/docs/api/v3/scheduler/)
- [Developer Forums](https://forums.nylas.com/)
