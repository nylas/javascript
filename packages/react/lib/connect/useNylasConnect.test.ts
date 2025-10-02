import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { useNylasConnect } from "./useNylasConnect";
import { NylasConnect } from "@nylas/connect";

// Mock the NylasConnect module
vi.mock("@nylas/connect", () => ({
  NylasConnect: vi.fn(),
}));

describe("useNylasConnect callback deduplication", () => {
  const mockCallback = vi.fn();
  const mockIsAutoCallbackEnabled = vi.fn();
  const mockGetSession = vi.fn();
  const mockOnConnectStateChange = vi.fn();

  const mockAuthClient = {
    callback: mockCallback,
    isAutoCallbackEnabled: mockIsAutoCallbackEnabled,
    getSession: mockGetSession,
    onConnectStateChange: mockOnConnectStateChange,
    logger: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      log: vi.fn(),
      setLevel: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn(),
    },
    setLogLevel: vi.fn(),
    connect: vi.fn(),
    logout: vi.fn(),
    isConnected: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (NylasConnect as any).mockImplementation(() => mockAuthClient);
    mockIsAutoCallbackEnabled.mockReturnValue(true);
    mockGetSession.mockResolvedValue(null);
    mockOnConnectStateChange.mockReturnValue(() => {});

    // Mock window.location with callback parameters
    Object.defineProperty(window, "location", {
      value: {
        href: "https://app.example.com/callback?code=auth123&state=xyz789",
      },
      writable: true,
    });

    // Mock history API
    Object.defineProperty(window, "history", {
      value: {
        replaceState: vi.fn(),
        state: {},
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should only call callback once despite React Strict Mode double-invocation", async () => {
    const config = {
      clientId: "test_client",
      redirectUri: "https://app.example.com/callback",
      autoHandleCallback: true,
    };

    // Render the hook in strict mode simulation (double effect execution)
    const { rerender } = renderHook(() => useNylasConnect(config));

    // Wait for effects to complete
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    // Simulate strict mode by re-rendering (which triggers effects again)
    rerender();

    // Wait a bit more to ensure no additional calls
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Callback should still only be called once
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback if session already exists", async () => {
    // Mock existing session
    mockGetSession.mockResolvedValue({
      accessToken: "existing_token",
      grantId: "grant123",
      grantInfo: { id: "user123", email: "test@example.com" },
    });

    const config = {
      clientId: "test_client",
      redirectUri: "https://app.example.com/callback",
      autoHandleCallback: true,
    };

    renderHook(() => useNylasConnect(config));

    // Wait for effects to complete
    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
    });

    // Callback should not be called when session exists
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should not call callback when URL has no callback parameters", async () => {
    // Change URL to not have callback parameters
    Object.defineProperty(window, "location", {
      value: {
        href: "https://app.example.com/dashboard",
      },
      writable: true,
    });

    const config = {
      clientId: "test_client",
      redirectUri: "https://app.example.com/callback",
      autoHandleCallback: true,
    };

    const { result } = renderHook(() => useNylasConnect(config));

    // Wait for the hook to finish loading (much better than setTimeout!)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Callback should not be called without callback parameters
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
