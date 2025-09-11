import { logger } from "./logger";

/**
 * Parse authorization code and state from URL parameters
 */
export function parseConnectCallback(url?: string): {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
} {
  const targetUrl =
    url || (globalThis.window ? globalThis.window.location.href : "");
  const urlObj = new URL(targetUrl);
  const params = urlObj.searchParams;

  logger.debug("Parsing auth callback URL", { url: targetUrl });

  return {
    code: params.get("code") || undefined,
    state: params.get("state") || undefined,
    error: params.get("error") || undefined,
    errorDescription: params.get("error_description") || undefined,
  };
}

/**
 * Check if current URL contains auth callback parameters
 */
export function isConnectCallback(url?: string): boolean {
  const { code, error } = parseConnectCallback(url);
  return !!(code || error);
}

/**
 * Clean auth parameters from URL without triggering navigation
 */
export function cleanUrl(): void {
  if (!globalThis.window?.history?.replaceState) {
    return;
  }

  const url = new URL(globalThis.window.location.href);
  const authParams = ["code", "state", "error", "error_description"];
  let cleaned = false;

  authParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      cleaned = true;
    }
  });

  if (cleaned) {
    logger.debug("Cleaning auth parameters from URL");
    globalThis.window.history.replaceState(
      globalThis.window.history.state,
      document.title,
      url.toString(),
    );
  }
}

/**
 * Build authorization URL
 */
export function buildAuthUrl(config: {
  apiUrl: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state: string;
  provider?: string;
  loginHint?: string;
  codeChallenge?: string; // optional to support backend-only (no PKCE)
}): string {
  // When PKCE is used (frontend flow), use URLSearchParams which encodes spaces as '+'.
  if (config.codeChallenge) {
    const url = new URL(`${config.apiUrl}/connect/auth`);
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", config.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", config.state);
    url.searchParams.set("access_type", "online");
    url.searchParams.set("code_challenge", config.codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");
    if (config.scopes && config.scopes.length > 0) {
      url.searchParams.set("scope", config.scopes.join(" "));
    }
    if (config.provider) {
      url.searchParams.set("provider", config.provider);
    }
    if (config.loginHint) {
      url.searchParams.set("login_hint", config.loginHint);
    }
    logger.debug("Built authorization URL", { url: url.toString() });
    return url.toString();
  }

  // Backend-only flow (no PKCE): build manually so spaces become '%20'.
  const base = `${config.apiUrl.replace(/\/+$/, "")}/connect/auth`;
  const params: Array<[string, string]> = [
    ["client_id", config.clientId],
    ["redirect_uri", config.redirectUri],
    ["response_type", "code"],
    ["state", config.state],
    ["access_type", "online"],
  ];

  if (config.scopes && config.scopes.length > 0) {
    params.push(["scope", config.scopes.join(" ")]);
  }
  if (config.provider) {
    params.push(["provider", config.provider]);
  }
  if (config.loginHint) {
    params.push(["login_hint", config.loginHint]);
  }

  const query = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  const url = `${base}?${query}`;
  logger.debug("Built authorization URL", { url });
  return url;
}
