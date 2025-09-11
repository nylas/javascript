/**
 * Supported OAuth providers
 */
export type Provider = "google" | "microsoft" | "imap" | "icloud";

/**
 * Google OAuth scopes for Nylas APIs
 * All scopes are prefixed with 'https://www.googleapis.com/auth/'
 */
export type GoogleScope =
  // Gmail scopes
  | "https://www.googleapis.com/auth/gmail.readonly"
  | "https://www.googleapis.com/auth/gmail.modify"
  | "https://www.googleapis.com/auth/gmail.send"
  | "https://www.googleapis.com/auth/gmail.compose"
  | "https://www.googleapis.com/auth/gmail.metadata"
  // Calendar scopes
  | "https://www.googleapis.com/auth/calendar.readonly"
  | "https://www.googleapis.com/auth/calendar.events.readonly"
  | "https://www.googleapis.com/auth/calendar.events"
  | "https://www.googleapis.com/auth/calendar"
  // Contacts scopes
  | "https://www.googleapis.com/auth/contacts.readonly"
  | "https://www.googleapis.com/auth/contacts";

/**
 * Microsoft OAuth scopes for Nylas APIs
 * All scopes are prefixed with 'https://graph.microsoft.com/'
 */
export type MicrosoftScope =
  // Mail scopes
  | "https://graph.microsoft.com/Mail.Read"
  | "https://graph.microsoft.com/Mail.ReadWrite"
  | "https://graph.microsoft.com/Mail.Send"
  | "https://graph.microsoft.com/Mail.Read.Shared"
  | "https://graph.microsoft.com/Mail.ReadWrite.Shared"
  // Calendar scopes
  | "https://graph.microsoft.com/Calendars.Read"
  | "https://graph.microsoft.com/Calendars.ReadWrite"
  | "https://graph.microsoft.com/Calendars.Read.Shared"
  | "https://graph.microsoft.com/Calendars.ReadWrite.Shared"
  // Contacts scopes
  | "https://graph.microsoft.com/Contacts.Read"
  | "https://graph.microsoft.com/Contacts.ReadWrite"
  | "https://graph.microsoft.com/Contacts.Read.Shared"
  | "https://graph.microsoft.com/Contacts.ReadWrite.Shared";

/**
 * Yahoo OAuth scopes for Nylas APIs
 */
export type YahooScope = "email" | "mail-r";

/**
 * Union of all supported OAuth scopes
 */
export type NylasScope = GoogleScope | MicrosoftScope | YahooScope | string;

/**
 * Provider-specific scope mappings
 */
export type ProviderScopes = {
  google?: GoogleScope[];
  microsoft?: MicrosoftScope[];
  yahoo?: YahooScope[];
  imap?: never; // IMAP doesn't support scopes
  icloud?: string[]; // iCloud uses custom scopes
};

/**
 * Environment configuration
 */
export type Environment = "development" | "staging" | "production";

/**
 * Core configuration for NylasConnect
 */
export interface ConnectConfig {
  /** Nylas Client ID (can be read from NYLAS_CLIENT_ID env var) */
  clientId?: string;
  /** Redirect URI for OAuth flow (can be read from NYLAS_REDIRECT_URI env var) */
  redirectUri?: string;
  /** Nylas Auth API URL (defaults based on environment) */
  apiUrl?:
    | "https://api.nylas.com"
    | "https://api.us.nylas.com"
    | "https://api.eu.nylas.com"
    | string;
  /** Environment (auto-detected or specified) */
  environment?: Environment;
  /** Default scopes to request - can be a simple array or provider-specific object */
  defaultScopes?: NylasScope[] | ProviderScopes;
  /** Enable debug mode (auto-enabled in development) */
  debug?: boolean;
  /** Control token persistence (default: true). When false, tokens are stored in memory only and won't survive page reloads */
  persistTokens?: boolean;
  /** Control automatic callback handling in React hook (default: true) */
  autoHandleCallback?: boolean;
  /** Set specific log level for the logger (overrides debug flag) */
  logLevel?: LogLevel | "off";
}

/**
 * Authentication method
 */
export type ConnectMethod = "popup" | "inline";

/**
 * Options for authentication flow
 */
export interface ConnectOptions<T extends Provider = Provider> {
  /** Authentication method (default: 'inline') */
  method?: ConnectMethod;
  /** Override default scopes */
  scopes?: NylasScope[];
  /** Specific provider */
  provider?: T;
  /** Email hint for login */
  loginHint?: string;
  /** Custom state parameter */
  state?: string;
  /** Popup window width (default: 500) */
  popupWidth?: number;
  /** Popup window height (default: 600) */
  popupHeight?: number;
}

/**
 * Result of successful authentication
 */
export interface ConnectResult {
  /** Access token */
  accessToken: string;
  /** ID token */
  idToken: string;
  /** Grant ID */
  grantId: string;
  /** Token expiration timestamp */
  expiresAt: number;
  /** Granted scopes */
  scope: string;
  /** Grant information */
  grantInfo?: GrantInfo;
}

/**
 * Grant information derived from ID token claims
 */
export interface GrantInfo {
  /** Subject ID (sub claim) */
  id: string;
  /** Email address */
  email: string;
  /** Display name */
  name?: string;
  /** Profile picture URL */
  picture?: string;
  /** OAuth provider */
  provider: string;
  /** Email verified flag */
  emailVerified?: boolean;
  /** Given name */
  givenName?: string;
  /** Family name */
  familyName?: string;
}

/**
 * Structured authentication error
 */
export interface ConnectError extends Error {
  /** Error code */
  code: string;
  /** Error description */
  description?: string;
  /** Suggestion on how to fix the error */
  fix?: string;
  /** Link to relevant documentation */
  docsUrl?: string;
  /** Original error if wrapped */
  originalError?: Error;
}

/**
 * PKCE code pair
 */
export interface PKCEPair {
  /** Code verifier */
  codeVerifier: string;
  /** Code challenge */
  codeChallenge: string;
}

/**
 * Token storage interface
 */
export interface TokenStorage {
  /** Store a value */
  set(key: string, value: string): Promise<void>;
  /** Retrieve a value */
  get(key: string): Promise<string | null>;
  /** Remove a value */
  remove(key: string): Promise<void>;
  /** Clear all values */
  clear(): Promise<void>;
}

/**
 * OAuth token response
 */
export interface TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  grant_id: string;
  refresh_token?: string;
}

/**
 * Debug log levels
 */
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

/**
 * Connection status
 */
export type ConnectionStatus =
  | "connected"
  | "expired"
  | "invalid"
  | "not_connected";

/**
 * Comprehensive auth events for state changes and user actions
 */
export type ConnectEvent =
  // Authentication Flow Events
  | "CONNECT_STARTED" // When connect() is called
  | "CONNECT_REDIRECT" // When redirecting to OAuth provider
  | "CONNECT_POPUP_OPENED" // When popup window opens
  | "CONNECT_POPUP_CLOSED" // When popup window closes
  | "CONNECT_CALLBACK_RECEIVED" // When callback URL is processed
  | "CONNECT_SUCCESS" // When authentication completes successfully
  | "CONNECT_ERROR" // When authentication fails
  | "CONNECT_CANCELLED" // When authentication is cancelled

  // Session Management Events
  | "SIGNED_IN" // When a grant becomes connected
  | "SIGNED_OUT" // When a grant signs out
  | "SESSION_RESTORED" // When existing session is found on init
  | "SESSION_EXPIRED" // When session expires naturally
  | "SESSION_INVALID" // When session is found to be invalid

  // Token Management Events
  | "TOKEN_REFRESHED" // When access token is refreshed (existing)
  | "TOKEN_REFRESH_ERROR" // When token refresh fails
  | "TOKEN_VALIDATION_ERROR" // When token validation fails

  // Grant & Profile Events
  | "GRANT_UPDATED" // When grant info changes
  | "GRANT_PROFILE_LOADED" // When grant profile is fetched

  // Connection & Network Events
  | "CONNECTION_STATUS_CHANGED" // When connection status changes
  | "NETWORK_ERROR" // When network requests fail

  // Storage Events
  | "STORAGE_ERROR" // When storage operations fail
  | "STORAGE_CLEARED"; // When auth storage is cleared

/**
 * Event data payloads for different event types
 */
export interface ConnectEventData {
  // Authentication Flow
  CONNECT_STARTED: {
    method: ConnectMethod;
    provider?: string;
    scopes: NylasScope[];
  };
  CONNECT_REDIRECT: { url: string; provider?: string };
  CONNECT_POPUP_OPENED: { url: string; provider?: string };
  CONNECT_POPUP_CLOSED: { reason: "completed" | "cancelled" | "error" };
  CONNECT_CALLBACK_RECEIVED: { code?: string; state?: string; error?: string };
  CONNECT_SUCCESS: { grantId: string; provider: string; scopes: NylasScope[] };
  CONNECT_ERROR: { error: ConnectError; step: string };
  CONNECT_CANCELLED: { reason: string };

  // Session Management
  SIGNED_IN: { session: ConnectResult; isNewLogin: boolean };
  SIGNED_OUT: {
    grantId?: string;
    reason: "user_initiated" | "expired" | "invalid";
  };
  SESSION_RESTORED: { session: ConnectResult; fromStorage: boolean };
  SESSION_EXPIRED: { grantId: string; expiresAt: number };
  SESSION_INVALID: { grantId: string; reason: string };

  // Token Management
  TOKEN_REFRESHED: { grantId: string; newExpiresAt: number };
  TOKEN_REFRESH_ERROR: { grantId: string; error: ConnectError };
  TOKEN_VALIDATION_ERROR: { grantId: string; error: ConnectError };

  // Grant & Profile
  GRANT_UPDATED: { grantInfo: GrantInfo; changes: Partial<GrantInfo> };
  GRANT_PROFILE_LOADED: { grantInfo: GrantInfo; source: "token" | "api" };

  // Connection & Network
  CONNECTION_STATUS_CHANGED: {
    status: ConnectionStatus;
    previousStatus: ConnectionStatus;
    grantId?: string;
  };
  NETWORK_ERROR: { operation: string; error: ConnectError };

  // Storage
  STORAGE_ERROR: { operation: string; key: string; error: Error };
  STORAGE_CLEARED: { reason: string };
}

/**
 * Enhanced auth state change callback with optional event data
 */
export type ConnectStateChangeCallback = <T extends ConnectEvent>(
  event: T,
  session: ConnectResult | null,
  data?: ConnectEventData[T],
) => void;

/**
 * Auth status message types for popup/redirect flows
 */
export enum ConnectStatus {
  SUCCESS = "NYLAS_CONNECT_SUCCESS",
  ERROR = "NYLAS_CONNECT_ERROR",
}

/**
 * Internal auth state for storage
 */
export interface ConnectState {
  codeVerifier: string;
  state: string;
  scopes: NylasScope[];
  timestamp: number;
}

/**
 * Session data stored in storage
 */
export interface SessionData {
  accessToken: string;
  idToken: string;
  grantId: string;
  expiresAt: number;
  scope: string;
  grantInfo?: GrantInfo;
  refreshToken?: string;
}
