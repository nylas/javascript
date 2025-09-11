import type { ConnectError } from "../types";

/**
 * Base authentication error class
 */
export class NylasConnectError extends Error implements ConnectError {
  public readonly code: string;
  public readonly description?: string;
  public readonly fix?: string;
  public readonly docsUrl?: string;
  public readonly originalError?: Error;

  constructor(
    code: string,
    message: string,
    description?: string,
    fix?: string,
    docsUrl?: string,
    originalError?: Error,
  ) {
    super(message);
    this.name = "NylasConnectError";
    this.code = code;
    this.description = description;
    this.fix = fix;
    this.docsUrl = docsUrl || "https://developer.nylas.com/docs/v3/auth/";
    this.originalError = originalError;
  }
}

/**
 * Configuration validation error
 */
export class ConfigError extends NylasConnectError {
  constructor(message: string, description?: string, fix?: string) {
    super(
      "config_error",
      message,
      description,
      fix,
      "https://developer.nylas.com/docs/v3/auth/",
    );
    this.name = "ConfigError";
  }
}

/**
 * Network/HTTP request error
 */
export class NetworkError extends NylasConnectError {
  constructor(message: string, description?: string, originalError?: Error) {
    super(
      "network_error",
      message,
      description,
      "Check your network connection and Nylas service status",
      "https://developer.nylas.com/docs/v3/auth/",
      originalError,
    );
    this.name = "NetworkError";
  }
}

/**
 * OAuth flow error
 */
export class OAuthError extends NylasConnectError {
  constructor(
    code: string,
    message: string,
    description?: string,
    fix?: string,
  ) {
    super(
      `oauth_${code}`,
      message,
      description,
      fix ||
        "Check the Nylas documentation for more information about this error.",
      "https://developer.nylas.com/docs/v3/auth/hosted-oauth-apikey/",
    );
    this.name = "OAuthError";
  }
}

/**
 * OAuth Access Denied Error
 */
export class OAuthAccessDeniedError extends OAuthError {
  constructor(description?: string) {
    super(
      "access_denied",
      "Grant access was denied",
      description,
      "The authentication was cancelled. Try authenticating again when ready to proceed.",
    );
    this.name = "OAuthAccessDeniedError";
  }
}

/**
 * OAuth Invalid Request Error
 */
export class OAuthInvalidRequestError extends OAuthError {
  constructor(description?: string) {
    super(
      "invalid_request",
      "The request is missing a required parameter or is otherwise invalid",
      description,
      "Check that your clientId and redirectUri are correct in your NylasConnect configuration.",
    );
    this.name = "OAuthInvalidRequestError";
  }
}

/**
 * OAuth Invalid Client Error
 */
export class OAuthInvalidClientError extends OAuthError {
  constructor(description?: string) {
    super(
      "invalid_client",
      "Client authentication failed",
      description,
      "Verify your Nylas Client ID is correct and the application is properly configured.",
    );
    this.name = "OAuthInvalidClientError";
  }
}

/**
 * OAuth Invalid Grant Error
 */
export class OAuthInvalidGrantError extends OAuthError {
  constructor(description?: string) {
    super(
      "invalid_grant",
      "The provided authorization grant is invalid",
      description,
      "The authorization code may have expired. Try authenticating again.",
    );
    this.name = "OAuthInvalidGrantError";
  }
}

/**
 * OAuth Unauthorized Client Error
 */
export class OAuthUnauthorizedClientError extends OAuthError {
  constructor(description?: string) {
    super(
      "unauthorized_client",
      "The client is not authorized to request an access token",
      description,
      "Check your application configuration in the Nylas Dashboard.",
    );
    this.name = "OAuthUnauthorizedClientError";
  }
}

/**
 * OAuth Unsupported Grant Type Error
 */
export class OAuthUnsupportedGrantTypeError extends OAuthError {
  constructor(description?: string) {
    super(
      "unsupported_grant_type",
      "The authorization grant type is not supported",
      description,
      "Ensure you're using the correct OAuth flow. Use PKCE for web applications.",
    );
    this.name = "OAuthUnsupportedGrantTypeError";
  }
}

/**
 * OAuth Invalid Scope Error
 */
export class OAuthInvalidScopeError extends OAuthError {
  constructor(description?: string) {
    super(
      "invalid_scope",
      "The requested scope is invalid or unknown",
      description,
      "Check that the requested scopes are valid and enabled for your application.",
    );
    this.name = "OAuthInvalidScopeError";
  }
}

/**
 * OAuth Server Error
 */
export class OAuthServerError extends OAuthError {
  constructor(description?: string) {
    super(
      "server_error",
      "The authorization server encountered an unexpected condition",
      description,
      "This is a temporary server issue. Try again in a few moments.",
    );
    this.name = "OAuthServerError";
  }
}

/**
 * OAuth Temporarily Unavailable Error
 */
export class OAuthTemporarilyUnavailableError extends OAuthError {
  constructor(description?: string) {
    super(
      "temporarily_unavailable",
      "The authorization server is temporarily unavailable",
      description,
      "The Nylas service is temporarily unavailable. Try again later.",
    );
    this.name = "OAuthTemporarilyUnavailableError";
  }
}

/**
 * Token validation/parsing error
 */
export class TokenError extends NylasConnectError {
  constructor(message: string, description?: string, originalError?: Error) {
    super(
      "token_error",
      message,
      description,
      "Ensure tokens are valid and not expired",
      "https://developer.nylas.com/docs/v3/auth/",
      originalError,
    );
    this.name = "TokenError";
  }
}

/**
 * Popup window error
 */
export class PopupError extends NylasConnectError {
  constructor(message: string, description?: string) {
    super(
      "popup_error",
      message,
      description,
      "Ensure popups are not blocked and try authenticating again",
      "https://developer.nylas.com/docs/v3/auth/",
    );
    this.name = "PopupError";
  }
}

/**
 * Create appropriate error from OAuth response
 */
export function createOAuthError(
  error: string,
  errorDescription?: string,
): OAuthError {
  switch (error) {
    case "access_denied":
      return new OAuthAccessDeniedError(errorDescription);
    case "invalid_request":
      return new OAuthInvalidRequestError(errorDescription);
    case "invalid_client":
      return new OAuthInvalidClientError(errorDescription);
    case "invalid_grant":
      return new OAuthInvalidGrantError(errorDescription);
    case "unauthorized_client":
      return new OAuthUnauthorizedClientError(errorDescription);
    case "unsupported_grant_type":
      return new OAuthUnsupportedGrantTypeError(errorDescription);
    case "invalid_scope":
      return new OAuthInvalidScopeError(errorDescription);
    case "server_error":
      return new OAuthServerError(errorDescription);
    case "temporarily_unavailable":
      return new OAuthTemporarilyUnavailableError(errorDescription);
    default:
      return new OAuthError(error, `OAuth error: ${error}`, errorDescription);
  }
}
