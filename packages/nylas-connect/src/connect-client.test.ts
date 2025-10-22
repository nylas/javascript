import { describe, it, expect, beforeEach, vi } from "vitest";
import pkg from "../package.json";
import { NylasConnect } from "./connect-client";
import { logger } from "./utils/logger";
import { LogLevel } from "./types";

// Make PKCE deterministic for assertions
vi.mock("./crypto/pkce", () => ({
  generatePKCE: async () => ({
    codeVerifier: "verifier123",
    codeChallenge: "challengeABC",
  }),
  generateState: () => "stateXYZ",
}));

function base64url(json: object): string {
  const str = JSON.stringify(json);
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

describe("NylasConnect (fundamentals)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("connect() in inline mode returns a URL with required params and stores auth state", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    const url = await auth.connect();
    expect(typeof url).toBe("string");
    expect(url).toContain("/connect/auth");
    expect(url).toContain(`client_id=${encodeURIComponent(clientId)}`);
    expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
    expect(url).toContain("code_challenge=challengeABC");
    expect(url).toContain("state=stateXYZ");

    // Stored auth state should be present in localStorage under the token storage prefix
    const prefixedKey = `@nylas/connect:nylas_auth_state_${clientId}`;
    const stored = localStorage.getItem(prefixedKey);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored as string);
    expect(parsed.codeVerifier).toBe("verifier123");
    expect(parsed.state).toBe("stateXYZ");
  });

  it("handleRedirectCallback() exchanges code for tokens, stores session, and returns ConnectResult", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({
      sub: "user_1",
      email: "alice@example.com",
      name: "Alice",
      provider: "google",
      email_verified: true,
    });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access_abc",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "email profile",
        grant_id: "grant_1",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    expect(result.accessToken).toBe("access_abc");
    expect(result.idToken).toBe(idToken);
    expect(result.grantId).toBe("grant_1");
    expect(result.scope).toBe("email profile");
    expect(result.grantInfo?.email).toBe("alice@example.com");

    // Session should be retrievable
    const session = await auth.getSession();
    expect(session).not.toBeNull();
    expect(session?.grantId).toBe("grant_1");

    // Tokens should be stored under token_grant
    expect(localStorage.getItem("@nylas/connect:token_grant_1")).toBeTruthy();
    expect(localStorage.getItem("@nylas/connect:token_default")).toBeTruthy();
  });

  it("sends x-nylas-connect header on token exchange", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    await auth.connect();

    // Minimal successful token response
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({ sub: "u" });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "a",
        id_token: idToken,
        grant_id: "g",
        expires_in: 3600,
        scope: "s",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    const lastCall = mockFetch.mock.calls.at(-1);
    expect(lastCall[1].headers["x-nylas-connect"]).toBe(pkg.version);
  });

  it("logout(grantId) removes the specific session and emits SIGNED_OUT", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    // Seed a fake session
    const fakeSession = {
      accessToken: "t",
      idToken: "h.e.y",
      grantId: "g",
      expiresAt: Date.now() + 100000,
      scope: "email",
    };
    localStorage.setItem("@nylas/connect:token_g", JSON.stringify(fakeSession));

    const spy = vi.fn();
    auth.onConnectStateChange(spy);
    await auth.logout("g");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("SIGNED_OUT", null, {
      grantId: "g",
      reason: "user_initiated",
    });
    expect(localStorage.getItem("@nylas/connect:token_g")).toBeNull();
  });

  it("setLogLevel controls logger levels correctly", () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    // Spy on console methods to verify logger behavior
    const consoleSpy = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };

    try {
      // Set WARN level - only warn and error messages should show
      auth.setLogLevel(LogLevel.WARN);

      // Reset spies
      Object.values(consoleSpy).forEach((spy) => spy.mockClear());

      // Test that only warn and error messages show
      logger.debug("debug should not show");
      logger.info("info should not show");
      logger.warn("warn should show");
      logger.error("error should show");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[WARN\]/),
        "warn should show",
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[ERROR\]/),
        "error should show",
      );

      // Disable all logs
      auth.setLogLevel("off");
      Object.values(consoleSpy).forEach((spy) => spy.mockClear());
      logger.debug("debug off");
      logger.info("info off");
      logger.warn("warn off");
      logger.error("error off");
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    } finally {
      // Clean up spies
      Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
      // Reset logger to default state (off)
      logger.setLevel("off");
    }
  });
});

describe("NylasConnect (backend-only getAuthUrl)", () => {
  const clientId = "client_backend_1";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("getAuthUrl returns URL without PKCE and does not persist auth state", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    const { url, state, scopes } = await auth.getAuthUrl();

    expect(typeof url).toBe("string");
    expect(state).toBe("stateXYZ"); // from mocked generateState
    expect(Array.isArray(scopes)).toBe(true);

    // URL assertions
    expect(url).toContain("/connect/auth");
    expect(url).toContain(`client_id=${encodeURIComponent(clientId)}`);
    expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
    expect(url).toContain("response_type=code");
    expect(url).toContain("state=stateXYZ");
    expect(url).toContain("access_type=online");
    expect(url).not.toContain("code_challenge=");
    expect(url).not.toContain("code_challenge_method=");

    // Should NOT have stored OAuth auth state in localStorage
    const oauthStateKey = `@nylas/connect:nylas_auth_state_${clientId}`;
    expect(localStorage.getItem(oauthStateKey)).toBeNull();
  });

  it("getAuthUrl includes provider and scopes when provided", async () => {
    const auth = new NylasConnect({ clientId, redirectUri });

    const { url } = await auth.getAuthUrl({
      provider: "google",
      scopes: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
    });

    expect(url).toContain("provider=google");
    expect(url).toContain(
      "scope=" +
        encodeURIComponent(
          "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly",
        ),
    );

    // Still no PKCE params in backend-only URL
    expect(url).not.toContain("code_challenge=");
    expect(url).not.toContain("code_challenge_method=");
  });
});

describe("NylasConnect (Provider-Specific Scopes)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should use simple array scopes when defaultScopes is an array", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: ["email", "profile"],
    });

    const url = await auth.connect();
    expect(typeof url).toBe("string");
    expect(url).toContain("scope=email+profile");
  });

  it("should use provider-specific scopes when provider is specified", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: {
        google: ["https://www.googleapis.com/auth/gmail.readonly"],
        microsoft: ["https://graph.microsoft.com/Mail.Read"],
      },
    });

    // Test Google scopes
    const googleUrl = await auth.connect({ provider: "google" });
    expect(typeof googleUrl).toBe("string");
    expect(googleUrl).toContain(
      "scope=" +
        encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly"),
    );

    // Test Microsoft scopes
    const msUrl = await auth.connect({ provider: "microsoft" });
    expect(typeof msUrl).toBe("string");
    expect(msUrl).toContain(
      "scope=" + encodeURIComponent("https://graph.microsoft.com/Mail.Read"),
    );
  });

  it("should return empty scopes when provider is specified but not in config", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: {
        google: ["https://www.googleapis.com/auth/gmail.readonly"],
      },
    });

    // Test provider not in config
    const url = await auth.connect({ provider: "microsoft" });
    expect(typeof url).toBe("string");
    expect(url).not.toContain("scope=");
  });

  it("should return empty scopes when no provider specified with provider-specific config", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: {
        google: ["https://www.googleapis.com/auth/gmail.readonly"],
        microsoft: ["https://graph.microsoft.com/Mail.Read"],
      },
    });

    // No provider specified
    const url = await auth.connect();
    expect(typeof url).toBe("string");
    expect(url).not.toContain("scope=");
  });

  it("should prioritize options.scopes over defaultScopes", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: {
        google: ["https://www.googleapis.com/auth/gmail.readonly"],
      },
    });

    // options.scopes should override defaultScopes
    const url = await auth.connect({
      provider: "google",
      scopes: ["custom", "scopes"],
    });
    expect(typeof url).toBe("string");
    expect(url).toContain("scope=custom+scopes");
    expect(url).not.toContain("gmail.readonly");
  });

  it("should prioritize options.scopes over simple array defaultScopes", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: ["email", "profile"],
    });

    // options.scopes should override defaultScopes
    const url = await auth.connect({
      scopes: ["custom", "scopes"],
    });
    expect(typeof url).toBe("string");
    expect(url).toContain("scope=custom+scopes");
    expect(url).not.toContain("email");
    expect(url).not.toContain("profile");
  });

  it("should handle empty provider-specific scopes correctly", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      defaultScopes: {
        google: [],
        microsoft: ["https://graph.microsoft.com/Mail.Read"],
      },
    });

    // Test provider with empty scopes
    const googleUrl = await auth.connect({ provider: "google" });
    expect(typeof googleUrl).toBe("string");
    expect(googleUrl).not.toContain("scope=");

    // Test provider with scopes
    const msUrl = await auth.connect({ provider: "microsoft" });
    expect(typeof msUrl).toBe("string");
    expect(msUrl).toContain(
      "scope=" + encodeURIComponent("https://graph.microsoft.com/Mail.Read"),
    );
  });

  it("should handle no defaultScopes specified", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      // No defaultScopes specified
    });

    const url = await auth.connect({ provider: "google" });
    expect(typeof url).toBe("string");
    expect(url).not.toContain("scope=");
  });
});

describe("NylasConnect (callback deduplication)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";
  const authCode = "auth_code_123";
  const state = "stateXYZ"; // Use the mocked state from PKCE module
  const callbackUrl = `${redirectUri}?code=${authCode}&state=${state}`;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should prevent duplicate callback processing for same auth code", async () => {
    const mockIdTokenPayload = {
      sub: "user123",
      email: "test@example.com",
      name: "Test Account",
      provider: "google",
    };

    const mockTokenResponse = {
      access_token: "access_token_123",
      id_token: `header.${base64url(mockIdTokenPayload)}.signature`,
      grant_id: "grant_123",
      expires_in: 3600,
      scope: "openid email",
    };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTokenResponse),
    });

    vi.stubGlobal("fetch", mockFetch);

    const auth = new NylasConnect({ clientId, redirectUri });

    // Prime storage by calling connect() first to set up auth state
    await auth.connect();

    // First callback should succeed
    const result1 = await auth.callback(callbackUrl);
    expect(result1).toBeTruthy();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second callback with same auth code should throw error
    await expect(auth.callback(callbackUrl)).rejects.toThrow(
      "Authorization code has already been processed",
    );

    // Fetch should not be called again
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should handle concurrent callback processing for same auth code", async () => {
    const mockIdTokenPayload = {
      sub: "user123",
      email: "test@example.com",
      name: "Test Account",
      provider: "google",
    };

    const mockTokenResponse = {
      access_token: "access_token_123",
      id_token: `header.${base64url(mockIdTokenPayload)}.signature`,
      grant_id: "grant_123",
      expires_in: 3600,
      scope: "openid email",
    };

    // Add a delay to simulate network request
    const mockFetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve(mockTokenResponse),
              }),
            100,
          ),
        ),
    );

    vi.stubGlobal("fetch", mockFetch);

    const auth = new NylasConnect({ clientId, redirectUri });

    // Prime storage by calling connect() first to set up auth state
    await auth.connect();

    // Start two concurrent callbacks with same auth code
    const promise1 = auth.callback(callbackUrl);
    const promise2 = auth.callback(callbackUrl);

    // Both promises should resolve to the same result
    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toEqual(result2);
    expect(result1.grantId).toBe("grant_123");

    // Fetch should only be called once despite two concurrent requests
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should not interfere with processing different auth codes", async () => {
    const mockIdTokenPayload = {
      sub: "user123",
      email: "test@example.com",
      name: "Test Account",
      provider: "google",
    };

    const mockTokenResponse = {
      access_token: "access_token_123",
      id_token: `header.${base64url(mockIdTokenPayload)}.signature`,
      grant_id: "grant_123",
      expires_in: 3600,
      scope: "openid email",
    };

    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTokenResponse),
    });

    vi.stubGlobal("fetch", mockFetch);

    const auth = new NylasConnect({ clientId, redirectUri });

    // Prime storage by calling connect() first to set up auth state
    await auth.connect();

    // Process first auth code successfully
    const result1 = await auth.callback(
      `${redirectUri}?code=auth_code_123&state=${state}`,
    );
    expect(result1.grantId).toBe("grant_123");

    // Verify that a different auth code is not marked as already processed
    // (This should fail at auth state validation, not at deduplication)
    await expect(
      auth.callback(`${redirectUri}?code=auth_code_456&state=${state}`),
    ).rejects.toThrow("No stored auth state found");

    // Fetch should only be called once for the successful callback
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should allow retry after failed callback processing", async () => {
    const mockIdTokenPayload = {
      sub: "user123",
      email: "test@example.com",
      name: "Test Account",
      provider: "google",
    };

    const mockTokenResponse = {
      access_token: "access_token_123",
      id_token: `header.${base64url(mockIdTokenPayload)}.signature`,
      grant_id: "grant_123",
      expires_in: 3600,
      scope: "openid email",
    };

    // First call fails, second succeeds
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      });

    vi.stubGlobal("fetch", mockFetch);

    const auth = new NylasConnect({ clientId, redirectUri });

    // Prime storage by calling connect() first to set up auth state
    await auth.connect();

    // First callback should fail
    await expect(auth.callback(callbackUrl)).rejects.toThrow(
      "Token exchange failed",
    );

    // Set up auth state for retry (since first failure may have cleaned it up)
    await auth.connect();

    // Second callback with same auth code should succeed (retry allowed)
    const result = await auth.callback(callbackUrl);
    expect(result.grantId).toBe("grant_123");

    // Both requests should have been made
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe("NylasConnect (sessions, validation, and events)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("getSession returns null and emits SESSION_EXPIRED when token is expired", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    const expiredSession = {
      accessToken: "t",
      idToken: "h.e.y",
      grantId: "g_expired",
      expiresAt: Date.now() - 1000,
      scope: "email",
    };
    localStorage.setItem(
      "@nylas/connect:token_default",
      JSON.stringify(expiredSession),
    );

    const spy = vi.fn();
    auth.onConnectStateChange(spy);

    const session = await auth.getSession();
    expect(session).toBeNull();

    expect(spy).toHaveBeenCalledWith("SESSION_EXPIRED", null, {
      grantId: "g_expired",
      expiresAt: expiredSession.expiresAt,
    });
    expect(localStorage.getItem("@nylas/connect:token_default")).toBeNull();
  });

  it("onAuthStateChange unsubscribe stops subsequent emissions", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });
    const spy = vi.fn();
    const unsubscribe = auth.onConnectStateChange(spy);

    await auth.connect(); // emits CONNECT_STARTED
    expect(spy).toHaveBeenCalled();

    spy.mockClear();
    unsubscribe();

    await auth.logout("any"); // would emit SIGNED_OUT if subscribed
    expect(spy).not.toHaveBeenCalled();
  });

  describe("getConnectionStatus", () => {
    it("returns not_connected when no session", async () => {
      const auth = new NylasConnect({
        clientId,
        redirectUri,
        apiUrl: "https://api.us.nylas.com",
      });
      const spy = vi.fn();
      auth.onConnectStateChange(spy);

      const status = await auth.getConnectionStatus();
      expect(status).toBe("not_connected");
      expect(spy).not.toHaveBeenCalledWith(
        "CONNECTION_STATUS_CHANGED",
        expect.anything(),
        expect.anything(),
      );
    });

    it("returns connected when token validates", async () => {
      const auth = new NylasConnect({
        clientId,
        redirectUri,
        apiUrl: "https://api.us.nylas.com",
      });

      const session = {
        accessToken: "t_ok",
        idToken: "h.e.y",
        grantId: "g_ok",
        expiresAt: Date.now() + 60_000,
        scope: "email",
      };
      localStorage.setItem(
        "@nylas/connect:token_default",
        JSON.stringify(session),
      );

      const spy = vi.fn();
      auth.onConnectStateChange(spy);

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ data: { grant_id: "g_ok" } }),
        }),
      );

      const status = await auth.getConnectionStatus();
      expect(status).toBe("connected");
      const lastCall = (fetch as any).mock.calls.at(-1);
      expect(lastCall[1]).toBeDefined();
      expect(lastCall[1].headers["x-nylas-connect"]).toBe(pkg.version);
      const emitted = spy.mock.calls.map((c) => c[0]);
      expect(emitted).not.toContain("CONNECTION_STATUS_CHANGED");
    });

    it("returns invalid when token fails validation", async () => {
      const auth = new NylasConnect({
        clientId,
        redirectUri,
        apiUrl: "https://api.us.nylas.com",
      });

      const session = {
        accessToken: "t_bad",
        idToken: "h.e.y",
        grantId: "g_bad",
        expiresAt: Date.now() + 60_000,
        scope: "email",
      };
      localStorage.setItem(
        "@nylas/connect:token_default",
        JSON.stringify(session),
      );

      const spy = vi.fn();
      auth.onConnectStateChange(spy);

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({}),
        }),
      );

      const status = await auth.getConnectionStatus();
      expect(status).toBe("invalid");
      const lastCall = (fetch as any).mock.calls.at(-1);
      expect(lastCall[1].headers["x-nylas-connect"]).toBe(pkg.version);
      const emitted = spy.mock.calls.map((c) => c[0]);
      expect(emitted).not.toContain("CONNECTION_STATUS_CHANGED");
    });
  });
});

describe("NylasConnect (custom code exchange)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("uses custom code exchange method when provided in config", async () => {
    const mockCustomExchange = vi.fn().mockResolvedValue({
      accessToken: "custom_access_token",
      idToken: "custom_id_token",
      grantId: "custom_grant_123",
      expiresAt: Date.now() + 3600000,
      scope: "email",
      grantInfo: {
        id: "user123",
        email: "test@example.com",
        name: "Test User",
        provider: "google",
      },
    });

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: [],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    // Mock successful token validation
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { grant_id: "custom_grant_123" } }),
      }),
    );

    // Simulate popup callback
    const spy = vi.fn();
    auth.onConnectStateChange(spy);

    // Simulate the callback flow
    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;
    const result = await auth.handleRedirectCallback(callbackUrl);

    // Verify custom exchange was called with correct parameters
    expect(mockCustomExchange).toHaveBeenCalledWith({
      code: "auth_code_123",
      state: "stateXYZ",
      codeVerifier: "verifier123",
      scopes: [],
      provider: undefined,
      clientId,
      redirectUri,
    });

    // Verify result
    expect(result.accessToken).toBe("custom_access_token");
    expect(result.grantId).toBe("custom_grant_123");

    // Trigger a token validation request so we can assert headers
    await auth.getConnectionStatus();

    // Verify header present on token validation call
    const lastCallCustom = (fetch as any).mock.calls.at(-1);
    expect(lastCallCustom[1].headers["x-nylas-connect"]).toBe(pkg.version);

    // Verify events were emitted
    const events = spy.mock.calls.map((call) => call[0]);
    expect(events).toContain("CONNECT_SUCCESS");
    expect(events).toContain("SIGNED_IN");
  });

  it("disables PKCE when custom code exchange is provided", async () => {
    const mockCustomExchange = vi.fn().mockResolvedValue({
      accessToken: "access_token",
      idToken: "id_token",
      grantId: "grant_123",
      expiresAt: Date.now() + 3600000,
      scope: "email",
    });

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
    });

    const url = await auth.connect({ method: "inline" });

    // URL should not contain PKCE parameters when custom exchange is used
    expect(url).not.toContain("code_challenge");
    expect(url).not.toContain("code_challenge_method");
    expect(url).toContain(`client_id=${encodeURIComponent(clientId)}`);
    expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
  });

  it("includes PKCE when no custom code exchange is provided", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    const url = await auth.connect({ method: "inline" });

    // URL should contain PKCE parameters when using built-in exchange
    expect(url).toContain("code_challenge=challengeABC");
    expect(url).toContain("code_challenge_method=S256");
  });

  it("validates custom code exchange result", async () => {
    const mockCustomExchange = vi.fn().mockResolvedValue({
      // Missing required fields
      idToken: "id_token",
      expiresAt: Date.now() + 3600000,
      scope: "email",
    });

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: [],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    const spy = vi.fn();
    auth.onConnectStateChange(spy);

    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;

    await expect(auth.handleRedirectCallback(callbackUrl)).rejects.toThrow(
      "Custom code exchange failed",
    );

    // Verify error event was emitted
    const events = spy.mock.calls.map((call) => call[0]);
    expect(events).toContain("CONNECT_ERROR");
  });

  it("handles custom code exchange errors gracefully", async () => {
    const mockCustomExchange = vi
      .fn()
      .mockRejectedValue(new Error("Backend exchange failed"));

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: [],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    const spy = vi.fn();
    auth.onConnectStateChange(spy);

    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;

    await expect(auth.handleRedirectCallback(callbackUrl)).rejects.toThrow(
      "Custom code exchange failed",
    );

    // Verify error event was emitted
    const events = spy.mock.calls.map((call) => call[0]);
    expect(events).toContain("CONNECT_ERROR");
  });

  it("passes correct parameters to custom code exchange with provider and scopes", async () => {
    const mockCustomExchange = vi.fn().mockResolvedValue({
      accessToken: "access_token",
      idToken: "id_token",
      grantId: "grant_123",
      expiresAt: Date.now() + 3600000,
      scope: "email calendar",
      grantInfo: {
        id: "user123",
        email: "test@example.com",
        name: "Test User",
        provider: "google",
      },
    });

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
      defaultScopes: ["email", "calendar"],
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: ["email", "calendar"],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    // Mock successful token validation
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { grant_id: "grant_123" } }),
      }),
    );

    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;
    await auth.handleRedirectCallback(callbackUrl);

    expect(mockCustomExchange).toHaveBeenCalledWith({
      code: "auth_code_123",
      state: "stateXYZ",
      codeVerifier: "verifier123",
      scopes: ["email", "calendar"],
      provider: undefined,
      clientId,
      redirectUri,
    });
  });

  it("stores tokens from custom code exchange correctly", async () => {
    const customResult = {
      accessToken: "custom_access_token",
      idToken: "custom_id_token",
      grantId: "custom_grant_123",
      expiresAt: Date.now() + 3600000,
      scope: "email",
      grantInfo: {
        id: "user123",
        email: "test@example.com",
        name: "Test User",
        provider: "google",
      },
    };

    const mockCustomExchange = vi.fn().mockResolvedValue(customResult);

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: [],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;
    await auth.handleRedirectCallback(callbackUrl);

    // Verify tokens were stored
    const storedSession = await auth.getSession("custom_grant_123");
    expect(storedSession).toEqual(customResult);

    // Verify default session was also set
    const defaultSession = await auth.getSession();
    expect(defaultSession).toEqual(customResult);
  });

  it("logs custom code exchange usage", async () => {
    const mockCustomExchange = vi.fn().mockResolvedValue({
      accessToken: "access_token",
      idToken: "id_token",
      grantId: "grant_123",
      expiresAt: Date.now() + 3600000,
      scope: "email",
    });

    // Enable debug logging
    logger.setLevel(LogLevel.DEBUG);
    const logSpy = vi.spyOn(logger, "info");

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      codeExchange: mockCustomExchange,
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: [],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    // Check authentication start logging
    await auth.connect({ method: "inline" });

    expect(logSpy).toHaveBeenCalledWith(
      "Starting authentication",
      expect.objectContaining({
        customCodeExchange: true,
      }),
    );

    // Check custom exchange logging
    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;
    await auth.handleRedirectCallback(callbackUrl);

    expect(logSpy).toHaveBeenCalledWith("Using custom code exchange method");
    expect(logSpy).toHaveBeenCalledWith(
      "Custom code exchange successful",
      expect.objectContaining({
        grantId: "grant_123",
        scope: "email",
      }),
    );
  });

  it("falls back to built-in exchange when no custom method provided", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    // Store auth state manually for the test
    const authState = {
      codeVerifier: "verifier123",
      state: "stateXYZ",
      scopes: [],
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `@nylas/connect:nylas_auth_state_${clientId}`,
      JSON.stringify(authState),
    );

    // Mock built-in token exchange
    const mockTokenResponse = {
      access_token: "builtin_access_token",
      id_token: createValidIdToken(),
      grant_id: "builtin_grant_123",
      expires_in: 3600,
      scope: "email",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTokenResponse,
      }),
    );

    const callbackUrl = `${redirectUri}?code=auth_code_123&state=stateXYZ`;
    const result = await auth.handleRedirectCallback(callbackUrl);

    // Verify built-in exchange was used
    expect(result.accessToken).toBe("builtin_access_token");
    expect(result.grantId).toBe("builtin_grant_123");
    const lastCall = (fetch as any).mock.calls.at(-1);
    expect(lastCall[0]).toBe("https://api.us.nylas.com/v3/connect/token");
    expect(lastCall[1].method).toBe("POST");
    expect(lastCall[1].headers["Content-Type"]).toBe("application/json");
    expect(lastCall[1].headers["x-nylas-connect"]).toBe(pkg.version);
  });

  function createValidIdToken(): string {
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      sub: "user123",
      email: "test@example.com",
      name: "Test User",
      provider: "google",
      email_verified: true,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    return [base64url(header), base64url(payload), "signature"].join(".");
  }
});

describe("NylasConnect (Identity Provider Token)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should include idp_claims in token exchange when identityProviderToken callback returns a token", async () => {
    const mockIdpToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const mockIdentityProviderToken = vi.fn().mockResolvedValue(mockIdpToken);

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      identityProviderToken: mockIdentityProviderToken,
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({
      sub: "user_1",
      email: "alice@example.com",
      name: "Alice",
      provider: "google",
      email_verified: true,
    });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access_abc",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "email profile",
        grant_id: "grant_1",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    // Verify the callback was called
    expect(mockIdentityProviderToken).toHaveBeenCalledTimes(1);

    // Verify the fetch was called with JSON content type and idp_claims
    const lastCallInclude = mockFetch.mock.calls.at(-1);
    expect(lastCallInclude[0]).toBe(
      "https://api.us.nylas.com/v3/connect/token",
    );
    expect(lastCallInclude[1].method).toBe("POST");
    expect(lastCallInclude[1].headers["Content-Type"]).toBe("application/json");
    expect(lastCallInclude[1].headers["x-nylas-connect"]).toBe(pkg.version);
    expect(lastCallInclude[1].body).toBe(
      JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code: "auth_code_1",
        grant_type: "authorization_code",
        code_verifier: "verifier123",
        idp_claims: mockIdpToken,
      }),
    );

    // Verify the result is still correct
    expect(result.accessToken).toBe("access_abc");
    expect(result.grantId).toBe("grant_1");
  });

  it("should not include idp_claims when identityProviderToken callback returns null", async () => {
    const mockIdentityProviderToken = vi.fn().mockResolvedValue(null);

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      identityProviderToken: mockIdentityProviderToken,
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({
      sub: "user_1",
      email: "alice@example.com",
      name: "Alice",
      provider: "google",
      email_verified: true,
    });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access_abc",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "email profile",
        grant_id: "grant_1",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    // Verify the fetch was called with JSON format but no idp_claims
    const lastCallNull = mockFetch.mock.calls.at(-1);
    expect(lastCallNull[0]).toBe("https://api.us.nylas.com/v3/connect/token");
    expect(lastCallNull[1].method).toBe("POST");
    expect(lastCallNull[1].headers["Content-Type"]).toBe("application/json");
    expect(lastCallNull[1].headers["x-nylas-connect"]).toBe(pkg.version);
    expect(lastCallNull[1].body).toBe(
      JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code: "auth_code_1",
        grant_type: "authorization_code",
        code_verifier: "verifier123",
        // No idp_claims field
      }),
    );

    // Verify the result is correct
    expect(result.accessToken).toBe("access_abc");
    expect(result.grantId).toBe("grant_1");
  });

  it("should handle empty string return from identityProviderToken callback", async () => {
    const mockIdentityProviderToken = vi.fn().mockResolvedValue("");

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      identityProviderToken: mockIdentityProviderToken,
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({
      sub: "user_1",
      email: "alice@example.com",
      name: "Alice",
      provider: "google",
      email_verified: true,
    });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access_abc",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "email profile",
        grant_id: "grant_1",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    // Verify the callback was called
    expect(mockIdentityProviderToken).toHaveBeenCalledTimes(1);

    // Verify the fetch was called without idp_claims (empty string is falsy)
    const lastCallEmpty = mockFetch.mock.calls.at(-1);
    expect(lastCallEmpty[0]).toBe("https://api.us.nylas.com/v3/connect/token");
    expect(lastCallEmpty[1].headers["x-nylas-connect"]).toBe(pkg.version);
    expect(lastCallEmpty[1].body).toBe(
      JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code: "auth_code_1",
        grant_type: "authorization_code",
        code_verifier: "verifier123",
        // No idp_claims field should be present for empty string
      }),
    );
  });

  it("should work without identityProviderToken callback (backward compatibility)", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      // No identityProviderToken callback
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({
      sub: "user_1",
      email: "alice@example.com",
      name: "Alice",
      provider: "google",
      email_verified: true,
    });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access_abc",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "email profile",
        grant_id: "grant_1",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    // Verify the fetch was called with JSON format but no idp_claims
    const lastCallNoCb = mockFetch.mock.calls.at(-1);
    expect(lastCallNoCb[0]).toBe("https://api.us.nylas.com/v3/connect/token");
    expect(lastCallNoCb[1].method).toBe("POST");
    expect(lastCallNoCb[1].headers["Content-Type"]).toBe("application/json");
    expect(lastCallNoCb[1].headers["x-nylas-connect"]).toBe(pkg.version);
    expect(lastCallNoCb[1].body).toBe(
      JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code: "auth_code_1",
        grant_type: "authorization_code",
        code_verifier: "verifier123",
        // No idp_claims field
      }),
    );

    // Verify the result is correct
    expect(result.accessToken).toBe("access_abc");
    expect(result.grantId).toBe("grant_1");
  });

  it("should work with synchronous identityProviderToken callback", async () => {
    const mockIdpToken = "sync.jwt.token";
    const mockIdentityProviderToken = vi.fn().mockReturnValue(mockIdpToken);

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      identityProviderToken: mockIdentityProviderToken,
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint
    const header = base64url({ alg: "none", typ: "JWT" });
    const payload = base64url({
      sub: "user_1",
      email: "alice@example.com",
      name: "Alice",
      provider: "google",
      email_verified: true,
    });
    const idToken = `${header}.${payload}.sig`;

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "access_abc",
        id_token: idToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "email profile",
        grant_id: "grant_1",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await auth.handleRedirectCallback(
      `${redirectUri}?code=auth_code_1&state=stateXYZ`,
    );

    // Verify the callback was called
    expect(mockIdentityProviderToken).toHaveBeenCalledTimes(1);

    // Verify the fetch was called with the sync token
    const lastCallSync = mockFetch.mock.calls.at(-1);
    expect(lastCallSync[0]).toBe("https://api.us.nylas.com/v3/connect/token");
    expect(lastCallSync[1].headers["x-nylas-connect"]).toBe(pkg.version);
    expect(lastCallSync[1].body).toBe(
      JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code: "auth_code_1",
        grant_type: "authorization_code",
        code_verifier: "verifier123",
        idp_claims: mockIdpToken,
      }),
    );
  });

  it("should fail token exchange when identityProviderToken callback throws an error", async () => {
    const mockError = new Error("IDP service unavailable");
    const mockIdentityProviderToken = vi.fn().mockRejectedValue(mockError);

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      identityProviderToken: mockIdentityProviderToken,
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Mock token endpoint (should not be called)
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    // Verify the callback error is thrown
    await expect(
      auth.handleRedirectCallback(
        `${redirectUri}?code=auth_code_1&state=stateXYZ`,
      ),
    ).rejects.toThrow("Identity provider token callback failed");

    // Verify the callback was called
    expect(mockIdentityProviderToken).toHaveBeenCalledTimes(1);

    // Verify the token endpoint was never called due to callback failure
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should emit NETWORK_ERROR event when identityProviderToken callback fails", async () => {
    const mockError = new Error("IDP service unavailable");
    const mockIdentityProviderToken = vi.fn().mockRejectedValue(mockError);

    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
      identityProviderToken: mockIdentityProviderToken,
    });

    // Prime storage by calling connect() first
    await auth.connect();

    // Set up event listener
    const mockEventCallback = vi.fn();
    auth.onConnectStateChange(mockEventCallback);

    // Mock token endpoint (should not be called)
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    // Attempt the callback
    await expect(
      auth.handleRedirectCallback(
        `${redirectUri}?code=auth_code_1&state=stateXYZ`,
      ),
    ).rejects.toThrow("Identity provider token callback failed");

    // Verify NETWORK_ERROR event was emitted for IDP callback failure
    expect(mockEventCallback).toHaveBeenCalledWith(
      "NETWORK_ERROR",
      null,
      expect.objectContaining({
        operation: "identity_provider_token_callback",
        error: expect.objectContaining({
          message: "Identity provider token callback failed",
          description: "Failed to retrieve external identity provider token",
        }),
      }),
    );
  });
});

describe("NylasConnect (API URL normalization)", () => {
  const clientId = "client_123";
  const redirectUri = "https://app.example/callback";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should append /v3 to default API URL when no version is present", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v3/connect/auth");
  });

  it("should append /v3 to custom API URL when no version is present", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://custom.api.com",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://custom.api.com/v3/connect/auth");
  });

  it("should preserve existing version suffix (v2)", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com/v2",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v2/connect/auth");
    expect(url).not.toContain("/v3");
  });

  it("should preserve existing version suffix (v1)", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com/v1",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v1/connect/auth");
    expect(url).not.toContain("/v3");
  });

  it("should handle trailing slashes correctly", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com/",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v3/connect/auth");
    expect(url).not.toContain("//v3"); // Should not have double slashes
  });

  it("should handle multiple trailing slashes correctly", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com///",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v3/connect/auth");
    expect(url).not.toContain("//v3"); // Should not have double slashes
  });

  it("should preserve version with trailing slashes", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com/v2/",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v2/connect/auth");
    expect(url).not.toContain("/v3");
  });

  it("should append /v3 to default URL when no apiUrl is provided", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      // No apiUrl provided - should use default
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v3/connect/auth");
  });

  it("should handle EU API URL correctly", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.eu.nylas.com",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.eu.nylas.com/v3/connect/auth");
  });

  it("should work with higher version numbers", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.us.nylas.com/v10",
    });

    const { url } = await auth.getAuthUrl();
    expect(url).toContain("https://api.us.nylas.com/v10/connect/auth");
    expect(url).not.toContain("/v3");
  });
});
