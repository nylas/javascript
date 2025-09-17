import type {
  ConnectConfig,
  ConnectOptions,
  ConnectResult,
  GrantInfo,
  TokenResponse,
  ConnectState,
  TokenStorage,
  Environment,
  ConnectionStatus,
  ConnectStateChangeCallback,
  ConnectEvent,
  ConnectEventData,
  SessionData,
  LogLevel,
  Provider,
} from "./types";
import { ConnectStatus } from "./types";
import { generatePKCE, generateState } from "./crypto/pkce";
import { BrowserTokenStorage } from "./storage/token-storage";
import { MemoryTokenStorage } from "./storage/memory-storage";
import { logger } from "./utils/logger";
import {
  ConfigError,
  NetworkError,
  OAuthError,
  TokenError,
  createOAuthError,
} from "./errors/connect-errors";

import { openPopup, waitForCallback } from "./utils/popup";
import {
  buildAuthUrl,
  parseConnectCallback,
  cleanUrl,
  isConnectCallback,
} from "./utils/redirect";

/**
 * Modern Nylas authentication client
 */
export class NylasConnect {
  private config: Required<Omit<ConnectConfig, "logLevel">> &
    Pick<ConnectConfig, "logLevel">;
  private storage: TokenStorage;
  private connectStateCallbacks: Set<ConnectStateChangeCallback> = new Set();

  // Callback deduplication state to prevent duplicate processing
  private callbackState: {
    processing: Map<string, Promise<ConnectResult>>; // Track active callbacks by auth code
    processed: Set<string>; // Track successfully processed auth codes
    lastCleanup: number; // Timestamp of last cleanup
  } = {
    processing: new Map(),
    processed: new Set(),
    lastCleanup: Date.now(),
  };

  constructor(config: ConnectConfig = {}) {
    // Resolve configuration with environment variables and defaults
    const resolvedConfig = this.resolveConfig(config);

    // Validate required configuration
    this.validateConfig(resolvedConfig);

    // Set configuration with smart defaults
    this.config = {
      clientId: resolvedConfig.clientId!,
      redirectUri: resolvedConfig.redirectUri!,
      apiUrl: resolvedConfig.apiUrl!,
      environment: resolvedConfig.environment!,
      defaultScopes: resolvedConfig.defaultScopes || [],
      debug: resolvedConfig.debug!,
      persistTokens: resolvedConfig.persistTokens!,
      autoHandleCallback: resolvedConfig.autoHandleCallback!,
      logLevel: resolvedConfig.logLevel,
    };

    // Configure logger based on config
    this.configureLogger();

    // Initialize storage
    this.storage = this.createStorage();

    // Log configuration (without sensitive data)
    logger.info("NylasConnect initialized", {
      clientId: this.config.clientId.substring(0, 8) + "...",
      apiUrl: this.config.apiUrl,
      environment: this.config.environment,
      defaultScopes: this.config.defaultScopes,
    });
  }

  /**
   * Resolve configuration with environment variables and smart defaults
   */
  private resolveConfig(config: ConnectConfig): ConnectConfig {
    const environment = this.detectEnvironment(config.environment);

    return {
      clientId: config.clientId || this.getEnvVar("NYLAS_CLIENT_ID"),
      redirectUri:
        config.redirectUri ||
        this.getEnvVar("NYLAS_REDIRECT_URI") ||
        this.detectRedirectUri(),
      apiUrl: config.apiUrl || "https://api.us.nylas.com",
      environment,
      defaultScopes: config.defaultScopes,
      debug: config.debug ?? environment === "development",
      persistTokens: config.persistTokens ?? true,
      autoHandleCallback: config.autoHandleCallback ?? true,
      logLevel: config.logLevel,
    };
  }

  /**
   * Configure logger based on auth config
   */
  private configureLogger(): void {
    // If logLevel is explicitly set, use it (overrides debug flag)
    if (this.config.logLevel !== undefined) {
      logger.setLevel(this.config.logLevel);
    } else if (this.config.debug) {
      // If debug is true, enable debug level
      logger.enable();
    } else {
      // If debug is false, disable logging
      logger.disable();
    }
  }

  /**
   * Validate required configuration
   */
  private validateConfig(config: ConnectConfig): void {
    if (!config.clientId) {
      throw new ConfigError(
        "clientId is required",
        "The Nylas Client ID is required to connect users",
        "Set clientId in the constructor or use the NYLAS_CLIENT_ID environment variable",
      );
    }

    if (!config.redirectUri) {
      throw new ConfigError(
        "redirectUri is required",
        "A valid redirect URI is required for OAuth flow",
        "Set redirectUri in the constructor or use the NYLAS_REDIRECT_URI environment variable",
      );
    }

    // Validate redirect URI format
    try {
      new URL(config.redirectUri);
    } catch {
      throw new ConfigError(
        "redirectUri must be a valid URL",
        "The redirect URI must be a valid HTTP/HTTPS URL",
        "Ensure your redirectUri starts with http:// or https:// and is properly formatted",
      );
    }
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(specified?: Environment): Environment {
    if (specified) return specified;

    // Check environment variables
    const nodeEnv = this.getEnvVar("NODE_ENV");
    if (nodeEnv === "production") return "production";
    if (nodeEnv === "staging" || nodeEnv === "test") return "staging";

    // Check if running in development (localhost, etc.)
    if (globalThis.window) {
      const hostname = globalThis.window.location.hostname;
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".local")
      ) {
        return "development";
      }
    }

    return "production"; // Default to production for safety
  }

  /**
   * Auto-detect redirect URI for development
   */
  private detectRedirectUri(): string | undefined {
    if (globalThis.window) {
      const { protocol, hostname, port } = globalThis.window.location;
      const portSuffix =
        port && port !== "80" && port !== "443" ? `:${port}` : "";
      return `${protocol}//${hostname}${portSuffix}/auth/callback`;
    }
    return undefined;
  }

  /**
   * Get environment variable (works in both browser and Node.js)
   */
  private getEnvVar(name: string): string | undefined {
    // Node.js environment
    if (typeof process !== "undefined" && process.env) {
      return process.env[name];
    }

    // Browser environment - check for build-time injected variables
    if (globalThis.window) {
      // Vite/Webpack style environment variables
      const envVar =
        (globalThis.window as any).process?.env?.[name] ||
        (globalThis.window as any).__ENV__?.[name] ||
        (globalThis.window as any)[name];
      return envVar;
    }

    return undefined;
  }

  /**
   * Subscribe to auth state changes
   */
  onConnectStateChange(callback: ConnectStateChangeCallback): () => void {
    this.connectStateCallbacks.add(callback);
    return () => this.connectStateCallbacks.delete(callback);
  }

  /**
   * Trigger auth state change event with optional event data
   */
  private triggerConnectStateChange<T extends ConnectEvent>(
    event: T,
    session: ConnectResult | null,
    data?: ConnectEventData[T],
  ): void {
    this.connectStateCallbacks.forEach((callback) => {
      try {
        callback(event, session, data);
      } catch (error) {
        logger.error("Error in auth state change callback:", error);
      }
    });
  }

  /**
   * Connect using OAuth2 flow
   * @param options Authentication options
   * @returns Promise<AuthResult> for popup flow, Promise<string> for inline flow
   */
  async connect(options: ConnectOptions = {}): Promise<ConnectResult | string> {
    const scopes = this.resolveScopes(options);

    // Emit CONNECT_STARTED event
    this.triggerConnectStateChange("CONNECT_STARTED", null, {
      method: options.method || "inline",
      provider: options.provider,
      scopes,
    });

    // 1. Check for existing valid session
    const existingSession = await this.getSession();
    if (existingSession) {
      // Emit SESSION_RESTORED instead of just SIGNED_IN for existing sessions
      this.triggerConnectStateChange("SESSION_RESTORED", existingSession, {
        session: existingSession,
        fromStorage: true,
      });
      return existingSession;
    }

    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = options.state || generateState();

    logger.info("Starting authentication", {
      method: options.method,
      scopes,
      provider: options.provider,
    });

    // Store auth state for later retrieval using global key
    const authState: ConnectState = {
      codeVerifier,
      state,
      scopes,
      timestamp: Date.now(),
    };

    // Use a global key that includes client ID and state for uniqueness
    const authStateKey = this.authStateKey();
    const oauthStorage = this.createOAuthStorage();
    await oauthStorage.set(authStateKey, JSON.stringify(authState));

    // Also store the current auth state key for easy retrieval
    logger.debug("Auth state stored", { authStateKey, authState });

    const authUrl = buildAuthUrl({
      apiUrl: this.config.apiUrl,
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      scopes,
      codeChallenge,
      state,
      provider: options.provider,
      loginHint: options.loginHint,
    });

    if (options.method === "popup") {
      // Popup flow - wait for completion
      logger.info("Starting popup authentication flow");

      // Emit CONNECT_POPUP_OPENED event
      this.triggerConnectStateChange("CONNECT_POPUP_OPENED", null, {
        url: authUrl,
        provider: options.provider,
      });

      try {
        const popup = openPopup(authUrl, {
          width: options.popupWidth || 500,
          height: options.popupHeight || 600,
        });

        const authCode = await waitForCallback(popup, state);

        // Emit CONNECT_POPUP_CLOSED event
        this.triggerConnectStateChange("CONNECT_POPUP_CLOSED", null, {
          reason: "completed",
        });

        const result = await this.exchangeCodeForTokens(authCode, codeVerifier);

        // Emit CONNECT_SUCCESS before SIGNED_IN
        this.triggerConnectStateChange("CONNECT_SUCCESS", result, {
          grantId: result.grantId,
          provider: result.grantInfo?.provider || "unknown",
          scopes: result.scope.split(" "),
        });

        // Trigger auth state change
        this.triggerConnectStateChange("SIGNED_IN", result, {
          session: result,
          isNewLogin: true,
        });

        return result;
      } catch (error) {
        // Determine if this was a cancellation or error
        const isCancellation =
          error instanceof Error &&
          (error.message.includes("closed") ||
            error.message.includes("cancelled"));

        // Emit CONNECT_POPUP_CLOSED with appropriate reason
        this.triggerConnectStateChange("CONNECT_POPUP_CLOSED", null, {
          reason: isCancellation ? "cancelled" : "error",
        });

        // Emit appropriate event based on error type
        if (isCancellation) {
          this.triggerConnectStateChange("CONNECT_CANCELLED", null, {
            reason: error.message,
          });
        } else {
          this.triggerConnectStateChange("CONNECT_ERROR", null, {
            error: error as any,
            step: "popup_authentication",
          });
        }

        throw error;
      }
    } else {
      // Inline flow - return URL for manual redirect
      logger.info("Starting inline authentication flow", { url: authUrl });

      // Emit CONNECT_REDIRECT event
      this.triggerConnectStateChange("CONNECT_REDIRECT", null, {
        url: authUrl,
        provider: options.provider,
      });

      return authUrl;
    }
  }

  /**
   * Build an authorization URL for backend-only flows (no PKCE).
   * This does not store any state or perform token exchange.
   * Intended for server-side (confidential) exchanges using an API key.
   */
  async getAuthUrl(options: ConnectOptions = {}): Promise<{
    url: string;
    state: string;
    scopes: string[];
  }> {
    const scopes = this.resolveScopes(options);
    const state = options.state || generateState();

    const url = buildAuthUrl({
      apiUrl: this.config.apiUrl,
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      scopes,
      state,
      provider: options.provider,
      loginHint: options.loginHint,
      // No codeChallenge: backend will exchange using API key (no PKCE)
    });

    return { url, state, scopes };
  }

  /**
   * Handle inline callback after OAuth flow
   */
  async handleRedirectCallback(url?: string): Promise<ConnectResult> {
    logger.info("Handling inline callback");

    const { code, state, error, errorDescription } = parseConnectCallback(url);

    // Emit CONNECT_CALLBACK_RECEIVED event
    this.triggerConnectStateChange("CONNECT_CALLBACK_RECEIVED", null, {
      code,
      state,
      error,
    });

    if (error) {
      // Emit CONNECT_ERROR for OAuth errors
      const authError = createOAuthError(error, errorDescription);
      this.triggerConnectStateChange("CONNECT_ERROR", null, {
        error: authError,
        step: "callback_processing",
      });
      throw authError;
    }

    if (!code) {
      throw new OAuthError(
        "invalid_request",
        "No authorization code found in callback",
      );
    }

    if (!state) {
      throw new OAuthError(
        "invalid_request",
        "No state parameter found in callback",
      );
    }

    // Retrieve stored auth state using multiple fallback strategies
    let storedState: ConnectState;

    logger.debug("Attempting to retrieve auth state", {
      state,
      clientId: this.config.clientId.substring(0, 8) + "...",
    });

    const authStateKey = this.authStateKey();
    const oauthStorage = this.createOAuthStorage();
    const storedStateStr = await oauthStorage.get(authStateKey);
    logger.debug("Specific key", {
      authStateKey,
      found: !!storedStateStr,
    });

    if (!storedStateStr) {
      logger.error("No auth state found with any strategy");
      throw new OAuthError("invalid_request", "No stored auth state found");
    }

    try {
      storedState = JSON.parse(storedStateStr);
    } catch {
      throw new OAuthError("invalid_request", "Invalid stored auth state");
    }

    // Validate auth state age (15 minutes TTL)
    const MAX_AGE_MS = 15 * 60 * 1000;
    if (Date.now() - storedState.timestamp > MAX_AGE_MS) {
      await oauthStorage.remove(authStateKey);
      throw new OAuthError("invalid_request", "Auth state expired");
    }

    // Verify state parameter
    if (state !== storedState.state) {
      throw new OAuthError("invalid_request", "State parameter mismatch");
    }

    // Exchange code for tokens BEFORE cleaning URL
    const result = await this.exchangeCodeForTokens(
      code,
      storedState.codeVerifier,
    );

    // Emit CONNECT_SUCCESS event
    this.triggerConnectStateChange("CONNECT_SUCCESS", result, {
      grantId: result.grantId,
      provider: result.grantInfo?.provider || "unknown",
      scopes: result.scope.split(" "),
    });

    // Emit SIGNED_IN event
    this.triggerConnectStateChange("SIGNED_IN", result, {
      session: result,
      isNewLogin: true,
    });

    // Clean up URL parameters only after successful token exchange
    cleanUrl();
    // Clean up stored state using the correct key
    await oauthStorage.remove(authStateKey);
    // Also clean up the current state key tracker
    return result;
  }

  /**
   * Clean up old callback state to prevent memory leaks
   */
  private cleanupCallbackState(): void {
    const now = Date.now();
    const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const STATE_TTL = 15 * 60 * 1000; // 15 minutes (matches auth state TTL)

    // Only cleanup every 5 minutes to avoid excessive work
    if (now - this.callbackState.lastCleanup < CLEANUP_INTERVAL) {
      return;
    }

    // Remove old processed codes (older than 15 minutes)
    const cutoffTime = now - STATE_TTL;

    // Note: We can't easily track when codes were processed without changing the Set
    // For now, we'll periodically clear the entire processed set since auth codes
    // are single-use and this prevents indefinite memory growth
    if (this.callbackState.processed.size > 100) {
      logger.debug("Cleaning up processed callback codes");
      this.callbackState.processed.clear();
    }

    this.callbackState.lastCleanup = now;
  }

  /**
   * Simplified callback handler that works fowh callbacks
   */
  async callback(url?: string): Promise<ConnectResult> {
    // Cleanup old callback state periodically
    this.cleanupCallbackState();

    const targetUrl =
      url || (globalThis.window ? globalThis.window.location.href : "");

    // Check if this URL contains auth callback parameters
    if (!isConnectCallback(targetUrl)) {
      // throw new OAuthError(
      //   "invalid_request",
      //   "No authentication callback parameters found in URL",
      //   "This URL does not appear to be an OAuth callback URL",
      // );
      return; // NO OP -- fail silently if not valid URL
    }

    // Parse callback parameters
    const { code, state, error, errorDescription } =
      parseConnectCallback(targetUrl);

    // Handle OAuth errors
    if (error) {
      throw createOAuthError(error, errorDescription);
    }

    // Deduplication logic for authorization codes
    if (code) {
      // Check if this authorization code was already processed successfully
      if (this.callbackState.processed.has(code)) {
        logger.debug("Authorization code already processed", {
          code: code.substring(0, 8) + "...",
        });
        throw new OAuthError(
          "invalid_request",
          "Authorization code has already been processed",
          "Each authorization code can only be used once",
        );
      }

      // Check if this authorization code is currently being processed
      if (this.callbackState.processing.has(code)) {
        logger.debug(
          "Authorization code currently being processed, returning existing promise",
          {
            code: code.substring(0, 8) + "...",
          },
        );
        return await this.callbackState.processing.get(code)!;
      }
    }

    // For popup flow, send message to parent window
    if (globalThis.window?.opener) {
      // Add origin check for security
      const allowedOrigin = new URL(this.config.redirectUri).origin;
      if (code && state) {
        globalThis.window.opener.postMessage(
          {
            type: ConnectStatus.SUCCESS,
            code,
            state,
          },
          allowedOrigin,
        );
      } else {
        globalThis.window.opener.postMessage(
          {
            type: ConnectStatus.ERROR,
            error: error || "invalid_request",
            error_description:
              errorDescription || "Missing code or state parameter",
          },
          allowedOrigin,
        );
      }
      globalThis.window.close();
      // Return a placeholder result (the actual result will be handled by the parent)
      return {
        accessToken: "",
        idToken: "",
        grantId: "",
        expiresAt: 0,
        scope: "",
      };
    }

    // For inline flow, use this auth instance with deduplication protection
    if (code) {
      // Track this processing attempt
      const processingPromise = this.handleRedirectCallback(targetUrl);
      this.callbackState.processing.set(code, processingPromise);

      try {
        const result = await processingPromise;

        // Mark as successfully processed
        this.callbackState.processed.add(code);
        logger.debug("Authorization code successfully processed", {
          code: code.substring(0, 8) + "...",
          grantId: result.grantId,
        });

        return result;
      } catch (error) {
        // Don't mark as processed on error - allow retry
        logger.debug("Authorization code processing failed", {
          code: code.substring(0, 8) + "...",
          error: (error as Error).message,
        });
        throw error;
      } finally {
        // Always remove from processing map
        this.callbackState.processing.delete(code);
      }
    }

    // Fallback for edge cases without auth code
    return await this.handleRedirectCallback(targetUrl);
  }

  /**
   * Validate an access token
   */
  private async validateToken(token?: string): Promise<boolean> {
    let accessToken = token;
    let grantId = "unknown";

    if (!accessToken) {
      const session = await this.getSession();
      if (!session) {
        return false;
      }
      accessToken = session.accessToken;
      grantId = session.grantId;
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/connect/tokeninfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `access_token=${encodeURIComponent(accessToken)}`,
      });

      const data = await response.json();
      const isValid = !!(response.ok && data?.data);

      if (!isValid) {
        // Emit TOKEN_VALIDATION_ERROR event
        this.triggerConnectStateChange("TOKEN_VALIDATION_ERROR", null, {
          grantId: data?.grant_id || grantId,
          error: new TokenError(
            "Token validation failed",
            "Token is invalid or expired",
          ),
        });
      }

      return isValid;
    } catch (error) {
      logger.error("Token validation failed", error);

      // Emit NETWORK_ERROR event
      this.triggerConnectStateChange("NETWORK_ERROR", null, {
        operation: "token_validation",
        error: new NetworkError(
          "Token validation failed",
          "Network request failed",
          error as Error,
        ),
      });

      return false;
    }
  }

  /**
   * Get current connection status
   */
  async getConnectionStatus(grantId?: string): Promise<ConnectionStatus> {
    const session = await this.getSession(grantId);
    if (!session) return "not_connected";
    const isValid = await this.validateToken(session.accessToken);
    const status = isValid ? "connected" : "invalid";

    // Note: To emit CONNECTION_STATUS_CHANGED, we'd need to track previous status
    // This could be added as a class property if needed

    return status;
  }

  /**
   * Get current session data
   */

  async getSession(grantId?: string): Promise<SessionData | null> {
    const key = this.tokenKey(grantId);

    try {
      const tokenStr = await this.storage.get(key);

      if (!tokenStr) {
        return null;
      }

      const tokenData = JSON.parse(tokenStr);

      // Check if session is expired
      if (Date.now() >= tokenData.expiresAt) {
        logger.info("Session expired, removing from storage");
        await this.storage.remove(key);

        // Emit SESSION_EXPIRED event
        this.triggerConnectStateChange("SESSION_EXPIRED", null, {
          grantId: tokenData.grantId || grantId || "unknown",
          expiresAt: tokenData.expiresAt,
        });

        return null;
      }

      return tokenData as SessionData;
    } catch (error) {
      await this.storage.remove(key);

      // Emit SESSION_INVALID event
      this.triggerConnectStateChange("SESSION_INVALID", null, {
        grantId: grantId || "unknown",
        reason: "Invalid stored session data",
      });

      // Also emit STORAGE_ERROR for storage issues
      if (error instanceof Error) {
        this.triggerConnectStateChange("STORAGE_ERROR", null, {
          operation: "get_session",
          key: key,
          error: error,
        });
      }

      return null;
    }
  }

  /**
   * Logout and clear stored tokens
   */
  async logout(grantId?: string): Promise<void> {
    if (grantId) {
      await this.storage.remove(this.tokenKey(grantId));
    } else {
      await this.storage.clear();
      // Emit STORAGE_CLEARED event when clearing all storage
      this.triggerConnectStateChange("STORAGE_CLEARED", null, {
        reason: "Grant logout",
      });
    }

    // Trigger enhanced SIGNED_OUT event
    this.triggerConnectStateChange("SIGNED_OUT", null, {
      grantId,
      reason: "user_initiated",
    });

    logger.info("Grant logged out", { grantId });
  }

  /**
   * Set logging level
   * @param level - Log level: LogLevel enum values or "off"
   */
  setLogLevel(level: LogLevel | "off"): void {
    logger.setLevel(level);
  }

  /**
   * Check if defaultScopes is configured as provider-specific
   */
  private isProviderSpecificScopes(
    scopes?: string[] | Partial<Record<Provider, string[]>>,
  ): scopes is Partial<Record<Provider, string[]>> {
    return (
      scopes != null && !Array.isArray(scopes) && typeof scopes === "object"
    );
  }

  /**
   * Resolve scopes based on provider and configuration
   */
  private resolveScopes(options: ConnectOptions): string[] {
    // Priority: options.scopes > provider-specific scopes > default scopes > empty array
    if (options.scopes) {
      return options.scopes;
    }

    if (this.isProviderSpecificScopes(this.config.defaultScopes)) {
      // Provider-specific scopes configuration
      if (options.provider) {
        return this.config.defaultScopes[options.provider] || [];
      }
      // No provider specified with provider-specific config - return empty array
      return [];
    }

    // Simple array format or undefined
    return this.config.defaultScopes || [];
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(
    code: string,
    codeVerifier: string,
  ): Promise<ConnectResult> {
    logger.debug(
      "Exchanging authorization code for tokens",
      code,
      codeVerifier,
    );

    const payload = {
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      code,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    };

    try {
      const response = await fetch(`${this.config.apiUrl}/connect/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error("Token exchange failed", {
          status: response.status,
          statusText: response.statusText,
          errorData,
          payload,
          url: `${this.config.apiUrl}/connect/token`,
        });

        const networkError = new NetworkError(
          `Token exchange failed: ${response.status}`,
          errorData.error_description ||
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
          new Error(`HTTP ${response.status}`),
        );

        // Emit NETWORK_ERROR event
        this.triggerConnectStateChange("NETWORK_ERROR", null, {
          operation: "token_exchange",
          error: networkError,
        });

        throw networkError;
      }

      const tokenResponse: TokenResponse = await response.json();

      // Parse grant info from ID token
      const grantInfo = this.parseIdToken(tokenResponse.id_token);

      const authResult: ConnectResult = {
        accessToken: tokenResponse.access_token,
        idToken: tokenResponse.id_token,
        grantId: tokenResponse.grant_id,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
        scope: tokenResponse.scope,
        grantInfo,
      };

      // Store tokens
      const key = this.tokenKey(tokenResponse.grant_id);
      await this.storage.set(key, JSON.stringify(authResult));

      // Also store as default if no other default exists
      const defaultToken = await this.storage.get(this.tokenKey());
      if (!defaultToken) {
        await this.storage.set(this.tokenKey(), JSON.stringify(authResult));
      }

      logger.info("Authentication successful", {
        grantId: tokenResponse.grant_id,
        scope: tokenResponse.scope,
      });

      return authResult;
    } catch (error) {
      if (error instanceof NetworkError) {
        // Already handled and emitted above
        throw error;
      }

      const networkError = new NetworkError(
        "Token exchange failed",
        "Failed to exchange authorization code for tokens",
        error as Error,
      );

      // Emit NETWORK_ERROR event for unexpected errors
      this.triggerConnectStateChange("NETWORK_ERROR", null, {
        operation: "token_exchange",
        error: networkError,
      });

      throw networkError;
    }
  }

  /**
   * Parse grant information from ID token
   */
  private parseIdToken(idToken: string): GrantInfo {
    try {
      // Simple JWT parsing (header.payload.signature)
      const parts = idToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      // Decode payload (base64url)
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const claims = JSON.parse(decoded);

      return {
        id: claims.sub,
        email: claims.email,
        name: claims.name || claims.given_name || claims.email,
        picture: claims.picture,
        provider: claims.provider || "unknown",
        emailVerified: claims.email_verified,
        givenName: claims.given_name,
        familyName: claims.family_name,
      };
    } catch (error) {
      logger.error("Failed to parse ID token", error);
      throw new TokenError(
        "Invalid ID token",
        "Failed to parse grant information from token",
      );
    }
  }

  /**
   * Create appropriate storage instance
   * Respects persistTokens setting - uses memory storage when persistTokens is false
   */
  private createStorage(): TokenStorage {
    // If persistTokens is false, always use memory storage
    if (!this.config.persistTokens) {
      return new MemoryTokenStorage();
    }

    try {
      if (globalThis.window?.localStorage) {
        const testKey = "__nylas_auth_test__";
        localStorage.setItem(testKey, "test");
        localStorage.removeItem(testKey);
        return new BrowserTokenStorage();
      }
    } catch {
      // localStorage not available - fallback to memory storage
    }

    // Fallback to memory storage when localStorage is not available
    return new MemoryTokenStorage();
  }

  /**
   * Create storage instance for OAuth temporary state
   * Always uses localStorage for OAuth flow reliability
   */
  private createOAuthStorage(): TokenStorage {
    try {
      if (globalThis.window?.localStorage) {
        const testKey = "__nylas_auth_test__";
        localStorage.setItem(testKey, "test");
        localStorage.removeItem(testKey);
        return new BrowserTokenStorage();
      }
    } catch {
      // localStorage not available - fallback to memory storage for OAuth flow
    }

    // Fallback to memory storage when localStorage is not available
    // OAuth state will be stored in memory (works for popup flow)
    return new MemoryTokenStorage();
  }

  private tokenKey(grantId?: string): string {
    return grantId ? `token_${grantId}` : "token_default";
  }
  private authStateKey(): string {
    return `nylas_auth_state_${this.config.clientId}`;
  }
}
