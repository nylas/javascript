import { useState, useEffect, useCallback, useRef } from "react";
import { NylasConnect } from "@nylas/connect";
import type {
  ConnectConfig as AuthConfig,
  ConnectOptions as AuthOptions,
  ConnectResult as AuthResult,
  GrantInfo,
  ConnectEvent as AuthEvent,
  ConnectEventData as AuthEventData,
  ConnectStateChangeCallback as AuthStateChangeCallback,
} from "@nylas/connect";
import { LogLevel } from "@nylas/connect";

/**
 * Configuration for the useNylasConnect React hook
 * Extends AuthConfig with connection-specific properties
 */
export interface UseNylasConnectConfig extends AuthConfig {
  /** Auto-refresh session interval in milliseconds (default: disabled) */
  autoRefreshInterval?: number;
  /** Initial loading state when hook mounts (default: true) */
  initialLoadingState?: boolean;
  /** Number of retry attempts for failed operations (default: 0) */
  retryAttempts?: number;
  /** Enable automatic error recovery for network errors (default: false) */
  enableAutoRecovery?: boolean;
}

export interface UseNylasConnectState {
  isConnected: boolean;
  grant: GrantInfo | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UseNylasConnectActions {
  connect: (options?: AuthOptions) => Promise<AuthResult | string>;
  logout: (grantId?: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  subscribe: (callback: AuthStateChangeCallback) => () => void;
  setLogLevel: (level: LogLevel | "off") => void;
}

export interface UseNylasConnectReturn
  extends UseNylasConnectState,
    UseNylasConnectActions {
  connectClient: NylasConnect;
}

export function useNylasConnect(
  config: UseNylasConnectConfig,
): UseNylasConnectReturn {
  // Extract hook-specific config
  const {
    autoRefreshInterval,
    initialLoadingState = true,
    retryAttempts = 0,
    enableAutoRecovery = false,
    ...connectionConfig
  } = config;

  // Create connect client instance (stable reference)
  const connectClientRef = useRef<NylasConnect | null>(null);
  if (!connectClientRef.current) {
    connectClientRef.current = new NylasConnect(connectionConfig);
  }
  const connectClient = connectClientRef.current;

  // Track callback processing state to prevent duplicates
  // This prevents React Strict Mode double-invocation and component re-mount issues
  // that cause multiple POST requests to /connect/token with the same auth code
  const callbackProcessingRef = useRef<{
    isProcessing: boolean; // Currently processing a callback
    processedUrl: string | null; // URL that was already processed
    hasProcessed: boolean; // Has successfully processed any callback
  }>({
    isProcessing: false,
    processedUrl: null,
    hasProcessed: false,
  });

  // Reset callback state when URL changes significantly (navigation away from callback)
  useEffect(() => {
    const currentUrl = globalThis.window?.location.href || "";
    const callbackState = callbackProcessingRef.current;

    // If URL no longer contains callback parameters and we've processed before, reset state
    const hasCallbackParams =
      currentUrl.includes("code=") && currentUrl.includes("state=");
    if (!hasCallbackParams && callbackState.hasProcessed) {
      callbackState.hasProcessed = false;
      callbackState.processedUrl = null;
    }
  });

  // Handle callback on app load (if enabled)
  useEffect(() => {
    if (!connectionConfig.autoHandleCallback) {
      return;
    }

    // Capture the callback state ref at effect creation time
    const callbackStateRef = callbackProcessingRef;

    const processCallback = async () => {
      const currentUrl = globalThis.window?.location.href || "";
      const callbackState = callbackStateRef.current;

      // Skip if already processing, processed this URL, or no callback params
      if (
        callbackState.isProcessing ||
        callbackState.processedUrl === currentUrl ||
        callbackState.hasProcessed
      ) {
        return;
      }

      // Check if URL contains OAuth callback parameters
      const hasCallbackParams =
        currentUrl.includes("code=") && currentUrl.includes("state=");
      if (!hasCallbackParams) {
        return;
      }

      // Check if we already have a valid session to avoid unnecessary processing
      try {
        const existingSession = await connectClient.getSession();
        if (existingSession) {
          // Mark as processed to prevent future attempts
          callbackState.hasProcessed = true;
          callbackState.processedUrl = currentUrl;
          return;
        }
      } catch (e) {
        // Continue with callback processing if session check fails
      }

      // Mark as processing to prevent concurrent attempts
      callbackState.isProcessing = true;
      callbackState.processedUrl = currentUrl;

      try {
        await connectClient.callback();
        callbackState.hasProcessed = true;

        // Additional URL cleanup as a safeguard (client should handle this)
        // but we ensure it's cleaned in case something went wrong
        if (globalThis.window?.history?.replaceState) {
          const url = new URL(globalThis.window.location.href);
          const authParams = ["code", "state", "error", "error_description"];
          let needsCleaning = false;

          authParams.forEach((param) => {
            if (url.searchParams.has(param)) {
              url.searchParams.delete(param);
              needsCleaning = true;
            }
          });

          if (needsCleaning) {
            globalThis.window.history.replaceState(
              globalThis.window.history.state,
              document.title,
              url.toString(),
            );
          }
        }
      } catch (e) {
        console.log("callback error", e);
        // Reset processing state on error to allow retry if needed
        callbackState.isProcessing = false;
        callbackState.processedUrl = null;
      } finally {
        callbackState.isProcessing = false;
      }
    };

    processCallback();

    // Cleanup function to reset state if component unmounts
    return () => {
      // Use the captured ref from effect scope
      const callbackState = callbackStateRef.current;
      // Only reset if we're not currently processing to avoid interrupting ongoing operations
      if (!callbackState?.isProcessing) {
        callbackState.processedUrl = null;
        callbackState.hasProcessed = false;
      }
    };
  }, [connectClient]);

  // Connection state
  const [state, setState] = useState<UseNylasConnectState>({
    isConnected: false,
    grant: null,
    isLoading: initialLoadingState,
    error: null,
  });

  // Initialize connection state on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const session = await connectClient.getSession();
        const connectionStatus = await connectClient.getConnectionStatus();
        const isConnected = connectionStatus === "connected";

        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isConnected,
            grant: session?.grantInfo || null,
            isLoading: false,
            error: null,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isConnected: false,
            grant: null,
            isLoading: false,
            error: error as Error,
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [connectClient]);

  // Auto-refresh session at specified interval
  useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const session = await connectClient.getSession();
        const connectionStatus = await connectClient.getConnectionStatus();
        const isConnected = connectionStatus === "connected";

        setState((prev) => ({
          ...prev,
          isConnected,
          grant: session?.grantInfo || null,
          error: null,
        }));
      } catch (error) {
        if (enableAutoRecovery) {
          // Attempt to recover from network errors silently
          console.debug(
            "Auto-refresh failed, will retry next interval:",
            error,
          );
        } else {
          setState((prev) => ({
            ...prev,
            error: error as Error,
          }));
        }
      }
    }, autoRefreshInterval);

    return () => clearInterval(intervalId);
  }, [connectClient, autoRefreshInterval, enableAutoRecovery]);

  // Subscribe to connection state changes
  useEffect(() => {
    const handleConnectionStateChange = (
      event: AuthEvent,
      session: AuthResult | null,
      data?: AuthEventData[AuthEvent],
    ) => {
      setState((prev) => {
        switch (event) {
          case "CONNECT_STARTED":
            return {
              ...prev,
              isLoading: true,
              error: null,
            };

          case "SIGNED_IN":
          case "SESSION_RESTORED":
            return {
              ...prev,
              isConnected: true,
              grant: session?.grantInfo || null,
              isLoading: false,
              error: null,
            };

          case "SIGNED_OUT":
            return {
              ...prev,
              isConnected: false,
              grant: null,
              isLoading: false,
              error: null,
            };

          case "CONNECT_ERROR":
          case "NETWORK_ERROR":
          case "TOKEN_VALIDATION_ERROR":
            return {
              ...prev,
              isLoading: false,
              error: (data as any)?.error || new Error("Authentication error"),
            };

          case "CONNECT_CANCELLED":
            return {
              ...prev,
              isLoading: false,
              error: null,
            };

          case "SESSION_EXPIRED":
          case "SESSION_INVALID":
            return {
              ...prev,
              isConnected: false,
              grant: null,
              isLoading: false,
              error: null,
            };

          default:
            return prev;
        }
      });
    };

    const unsubscribe = connectClient.onConnectStateChange(
      handleConnectionStateChange,
    );

    return unsubscribe;
  }, [connectClient]);

  // Wrapped connect method with retry logic
  const connect = useCallback(
    async (options: AuthOptions = {}) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      let lastError: Error;
      const maxAttempts = retryAttempts + 1;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await connectClient.connect(options);
          return result;
        } catch (error) {
          lastError = error as Error;

          if (attempt < maxAttempts) {
            // Wait before retry (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      // All attempts failed
      throw lastError!;
    },
    [connectClient, retryAttempts],
  );

  // Wrapped logout method with retry logic
  const logout = useCallback(
    async (grantId?: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      let lastError: Error;
      const maxAttempts = retryAttempts + 1;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await connectClient.logout(grantId);
          return;
        } catch (error) {
          lastError = error as Error;

          if (attempt < maxAttempts) {
            // Wait before retry
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      // All attempts failed
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: lastError!,
      }));
      throw lastError!;
    },
    [connectClient, retryAttempts],
  );

  // Refresh session method with retry logic
  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    let lastError: Error;
    const maxAttempts = retryAttempts + 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const session = await connectClient.getSession();
        const connectionStatus = await connectClient.getConnectionStatus();
        const isConnected = connectionStatus === "connected";

        setState((prev) => ({
          ...prev,
          isConnected,
          grant: session?.grantInfo || null,
          isLoading: false,
          error: null,
        }));
        return;
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          // Wait before retry
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All attempts failed
    setState((prev) => ({
      ...prev,
      isConnected: false,
      grant: null,
      isLoading: false,
      error: lastError!,
    }));
    throw lastError!;
  }, [connectClient, retryAttempts]);

  // Subscribe method for listening to connection events
  const subscribe = useCallback(
    (callback: AuthStateChangeCallback) => {
      return connectClient.onConnectStateChange(callback);
    },
    [connectClient],
  );

  const setLogLevel = useCallback(
    (level: LogLevel | "off") => {
      connectClient.setLogLevel(level);
    },
    [connectClient],
  );

  return {
    // State
    ...state,

    // Actions
    connect,
    logout,
    refreshSession,
    subscribe,

    // Logger controls
    setLogLevel,

    // Direct access
    connectClient,
  };
}
