import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { NylasConnectButton } from "./NylasConnectButton";
import { useNylasConnect } from "./useNylasConnect";
import type { ConnectResult } from "@nylas/connect";

// Mock the useNylasConnect hook
vi.mock("./useNylasConnect", () => ({
  useNylasConnect: vi.fn(),
}));

describe("NylasConnectButton", () => {
  const mockConnect = vi.fn();
  const mockUseNylasConnect = vi.mocked(useNylasConnect);

  const defaultProps = {
    clientId: "test-client-id",
    redirectUri: "https://app.example.com/callback",
  };

  const mockConnectResult: ConnectResult = {
    accessToken: "test-token",
    idToken: "test-id-token",
    grantId: "test-grant-id",
    expiresAt: Date.now() + 3600 * 1000,
    scope: "email.read",
    grantInfo: {
      id: "test-grant-id",
      email: "test@example.com",
      provider: "google",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    mockUseNylasConnect.mockReturnValue({
      connect: mockConnect,
      isLoading: false,
      isConnected: false,
      grant: null,
      error: null,
      logout: vi.fn(),
      refreshSession: vi.fn(),
      subscribe: vi.fn(),
      setLogLevel: vi.fn(),
      connectClient: {} as any,
    });

    // Mock window.location.assign
    Object.defineProperty(window, "location", {
      value: {
        assign: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders with default props", () => {
      render(React.createElement(NylasConnectButton, defaultProps));

      const button = screen.getByRole("button");
      expect(button).toBeTruthy();
      expect(button.textContent).toBe("Connect your inbox");
      expect(button.className).toContain("nylas-btn");
      expect(button.className).toContain("nylas-btn--primary");
      expect(button.className).toContain("nylas-btn--md");
    });

    it("renders with custom text", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          text: "Custom Connect Text",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toBe("Custom Connect Text");
    });

    it("renders with children instead of text", () => {
      render(
        React.createElement(
          NylasConnectButton,
          defaultProps,
          "Custom Children",
        ),
      );

      const button = screen.getByRole("button");
      expect(button.textContent).toBe("Custom Children");
    });

    it("renders with custom className", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          className: "custom-class",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("nylas-btn");
      expect(button.className).toContain("nylas-btn--primary");
      expect(button.className).toContain("nylas-btn--md");
      expect(button.className).toContain("custom-class");
    });

    it("renders with custom style", () => {
      const customStyle = { backgroundColor: "red", color: "white" };
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          style: customStyle,
        }),
      );

      const button = screen.getByRole("button");
      expect((button as HTMLElement).style.backgroundColor).toBe("red");
      expect((button as HTMLElement).style.color).toBe("white");
    });
  });

  describe("Styling Variants", () => {
    it("applies primary variant class", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          variant: "primary",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("nylas-btn--primary");
    });

    it("applies outline variant class", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          variant: "outline",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("nylas-btn--outline");
    });

    it("applies small size class", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          size: "sm",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("nylas-btn--sm");
    });

    it("applies large size class", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          size: "lg",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("nylas-btn--lg");
    });

    it("renders unstyled when unstyled prop is true", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          unstyled: true,
          className: "custom-only",
        }),
      );

      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-only");
      expect(button.className).not.toContain("nylas-btn");
    });

    it("applies CSS custom properties from cssVars", () => {
      const cssVars = {
        "--nylas-btn-bg": "#ff0000",
        "--nylas-btn-fg": "#ffffff",
      };
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          cssVars,
        }),
      );

      const button = screen.getByRole("button") as HTMLElement;
      expect(button.style.getPropertyValue("--nylas-btn-bg")).toBe("#ff0000");
      expect(button.style.getPropertyValue("--nylas-btn-fg")).toBe("#ffffff");
    });
  });

  describe("Disabled States", () => {
    it("is disabled when disabled prop is true", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          disabled: true,
        }),
      );

      const button = screen.getByRole("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it("is disabled when loading", () => {
      mockUseNylasConnect.mockReturnValue({
        connect: mockConnect,
        isLoading: true,
        isConnected: false,
        grant: null,
        error: null,
        logout: vi.fn(),
        refreshSession: vi.fn(),
        subscribe: vi.fn(),
        setLogLevel: vi.fn(),
        connectClient: {} as any,
      });

      render(React.createElement(NylasConnectButton, defaultProps));

      const button = screen.getByRole("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      expect(button.getAttribute("aria-busy")).toBe("true");
    });
  });

  describe("Click Handling", () => {
    it("calls onStart callback when clicked", async () => {
      const onStart = vi.fn();
      mockConnect.mockResolvedValue(mockConnectResult);

      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          onStart,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it("calls connect with correct options", async () => {
      mockConnect.mockResolvedValue(mockConnectResult);

      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          method: "popup",
          provider: "google",
          scopes: ["email.read"],
          loginHint: "user@example.com",
          popupWidth: 500,
          popupHeight: 600,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockConnect).toHaveBeenCalledWith({
        method: "popup",
        provider: "google",
        scopes: ["email.read"],
        loginHint: "user@example.com",
        popupWidth: 500,
        popupHeight: 600,
      });
    });

    it("calls onSuccess when connect succeeds with result", async () => {
      const onSuccess = vi.fn();
      mockConnect.mockResolvedValue(mockConnectResult);

      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          onSuccess,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockConnectResult);
      });
    });

    it("redirects when connect returns a URL string", async () => {
      const redirectUrl = "https://auth.nylas.com/oauth/authorize?...";
      mockConnect.mockResolvedValue(redirectUrl);

      render(React.createElement(NylasConnectButton, defaultProps));

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith(redirectUrl);
      });
    });

    it("calls onError when connect fails", async () => {
      const onError = vi.fn();
      const error = new Error("Connection failed");
      mockConnect.mockRejectedValue(error);

      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          onError,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });

    it("calls onCancel when user cancels", async () => {
      const onCancel = vi.fn();
      const cancelError = new Error("User closed the popup");
      mockConnect.mockRejectedValue(cancelError);

      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          onCancel,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalledWith("User closed the popup");
      });
    });

    it("calls onCancel when operation is cancelled", async () => {
      const onCancel = vi.fn();
      const cancelError = new Error("Operation was cancelled by user");
      mockConnect.mockRejectedValue(cancelError);

      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          onCancel,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalledWith(
          "Operation was cancelled by user",
        );
      });
    });

    it("does not call click handler when disabled", () => {
      render(
        React.createElement(NylasConnectButton, {
          ...defaultProps,
          disabled: true,
        }),
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockConnect).not.toHaveBeenCalled();
    });
  });

  describe("Hook Integration", () => {
    it("passes clientId to useNylasConnect", () => {
      render(
        React.createElement(NylasConnectButton, {
          clientId: "test-client-123",
          redirectUri: "https://app.test.com/callback",
        }),
      );

      expect(mockUseNylasConnect).toHaveBeenCalledWith({
        clientId: "test-client-123",
        redirectUri: "https://app.test.com/callback",
        autoHandleCallback: true,
      });
    });

    it("passes optional config to useNylasConnect", () => {
      render(
        React.createElement(NylasConnectButton, {
          clientId: "test-client",
          redirectUri: "https://app.test.com/callback",
          apiUrl: "https://api.nylas.com",
          defaultScopes: ["email.read", "calendar.read"],
          persistTokens: false,
        }),
      );

      expect(mockUseNylasConnect).toHaveBeenCalledWith({
        clientId: "test-client",
        redirectUri: "https://app.test.com/callback",
        apiUrl: "https://api.nylas.com",
        defaultScopes: ["email.read", "calendar.read"],
        persistTokens: false,
        autoHandleCallback: true,
      });
    });

    it("does not pass defaultScopes when not provided", () => {
      render(
        React.createElement(NylasConnectButton, {
          clientId: "test-client",
          redirectUri: "https://app.test.com/callback",
        }),
      );

      expect(mockUseNylasConnect).toHaveBeenCalledWith({
        clientId: "test-client",
        redirectUri: "https://app.test.com/callback",
        autoHandleCallback: true,
      });
    });
  });

  describe("Accessibility", () => {
    it("has correct button type", () => {
      render(React.createElement(NylasConnectButton, defaultProps));

      const button = screen.getByRole("button") as HTMLButtonElement;
      expect(button.getAttribute("type")).toBe("button");
    });

    it("sets aria-busy when loading", () => {
      mockUseNylasConnect.mockReturnValue({
        connect: mockConnect,
        isLoading: true,
        isConnected: false,
        grant: null,
        error: null,
        logout: vi.fn(),
        refreshSession: vi.fn(),
        subscribe: vi.fn(),
        setLogLevel: vi.fn(),
        connectClient: {} as any,
      });

      render(React.createElement(NylasConnectButton, defaultProps));

      const button = screen.getByRole("button");
      expect(button.getAttribute("aria-busy")).toBe("true");
    });

    it("does not set aria-busy when not loading", () => {
      render(React.createElement(NylasConnectButton, defaultProps));

      const button = screen.getByRole("button");
      expect(button.hasAttribute("aria-busy")).toBe(false);
    });
  });
});
