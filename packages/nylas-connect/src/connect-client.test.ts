import { describe, it, expect, beforeEach, vi } from "vitest";
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
      apiUrl: "https://api.nylas.com",
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
      apiUrl: "https://api.nylas.com",
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

  it("logout(grantId) removes the specific session and emits SIGNED_OUT", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.nylas.com",
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

  it("enableDebug() and disableDebug() control logger levels correctly", () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.nylas.com",
    });

    // Spy on console methods to verify logger behavior
    const consoleSpy = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };

    try {
      // Test enableDebug - should enable debug level logging
      auth.enableDebug();

      // Reset spies
      Object.values(consoleSpy).forEach((spy) => spy.mockClear());

      // Test that debug messages now show
      logger.debug("test debug message");
      logger.info("test info message");

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[DEBUG\]/),
        "test debug message",
      );
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[INFO\]/),
        "test info message",
      );

      // Test disableDebug - should disable all logging
      auth.disableDebug();

      // Reset spies
      Object.values(consoleSpy).forEach((spy) => spy.mockClear());

      // Test that no messages show now
      logger.debug("debug should not show");
      logger.info("info should not show");
      logger.warn("warn should not show");
      logger.error("error should not show");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();

      // Test setLogLevel method
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
      apiUrl: "https://api.nylas.com",
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
      apiUrl: "https://api.nylas.com",
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

  it("validateToken returns true when response ok and has data", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.nylas.com",
    });

    const validSession = {
      accessToken: "t_ok",
      idToken: "h.e.y",
      grantId: "g_ok",
      expiresAt: Date.now() + 60_000,
      scope: "email",
    };
    localStorage.setItem(
      "@nylas/connect:token_default",
      JSON.stringify(validSession),
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

    const result = await auth.validateToken();
    expect(result).toBe(true);
    expect(spy).not.toHaveBeenCalledWith(
      "TOKEN_VALIDATION_ERROR",
      expect.anything(),
      expect.anything(),
    );
  });

  it("validateToken returns false and emits TOKEN_VALIDATION_ERROR when invalid", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.nylas.com",
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

    const result = await auth.validateToken();
    expect(result).toBe(false);
    expect(spy).toHaveBeenCalledWith(
      "TOKEN_VALIDATION_ERROR",
      null,
      expect.objectContaining({ grantId: "g_bad" }),
    );
  });

  it("onAuthStateChange unsubscribe stops subsequent emissions", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.nylas.com",
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

  it("getGrantInfo emits GRANT_PROFILE_LOADED with source 'token'", async () => {
    const auth = new NylasConnect({
      clientId,
      redirectUri,
      apiUrl: "https://api.nylas.com",
    });

    const grantInfo = {
      id: "user_1",
      email: "alice@example.com",
      name: "Alice",
      picture: "https://example.com/p.png",
      provider: "google",
      emailVerified: true,
    };

    const session = {
      accessToken: "t",
      idToken: "h.e.y",
      grantId: "g1",
      expiresAt: Date.now() + 60_000,
      scope: "email profile",
      grantInfo,
    };
    localStorage.setItem(
      "@nylas/connect:token_default",
      JSON.stringify(session),
    );

    const spy = vi.fn();
    auth.onConnectStateChange(spy);

    const result = await auth.getGrantInfo();
    expect(result).toEqual(grantInfo);

    expect(spy).toHaveBeenCalledWith(
      "GRANT_PROFILE_LOADED",
      expect.objectContaining({ grantId: "g1" }),
      { grantInfo, source: "token" },
    );
  });

  describe("getConnectionStatus", () => {
    it("returns not_connected when no session", async () => {
      const auth = new NylasConnect({
        clientId,
        redirectUri,
        apiUrl: "https://api.nylas.com",
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
        apiUrl: "https://api.nylas.com",
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
      const emitted = spy.mock.calls.map((c) => c[0]);
      expect(emitted).not.toContain("CONNECTION_STATUS_CHANGED");
    });

    it("returns invalid when token fails validation", async () => {
      const auth = new NylasConnect({
        clientId,
        redirectUri,
        apiUrl: "https://api.nylas.com",
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
      const emitted = spy.mock.calls.map((c) => c[0]);
      expect(emitted).not.toContain("CONNECTION_STATUS_CHANGED");
    });
  });
});
