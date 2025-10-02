// Re-export connect types from @nylas/connect for convenience
export type {
  ConnectConfig,
  ConnectOptions,
  ConnectResult,
  GrantInfo,
  ConnectError,
  PKCEPair,
  TokenStorage,
  TokenResponse,
  LogLevel,
  Provider,
  Environment,
  ConnectMethod,
  ConnectionStatus,
  ConnectEvent,
  ConnectStateChangeCallback,
  SessionData,
} from "@nylas/connect";

// Export hook-specific types
export type {
  UseNylasConnectConfig,
  UseNylasConnectState,
  UseNylasConnectActions,
  UseNylasConnectReturn,
} from "./useNylasConnect";
