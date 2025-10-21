// Core exports
export { NylasConnect } from "./connect-client";

// Type exports
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
  ConnectEventData,
  ConnectStateChangeCallback,
  SessionData,
  IdentityProviderTokenCallback,
  CodeExchangeMethod,
  CodeExchangeParams,
  // OAuth scope types
  GoogleScope,
  MicrosoftScope,
  YahooScope,
  NylasScope,
  ProviderScopes,
} from "./types";

// Error exports
export {
  NylasConnectError,
  ConfigError,
  NetworkError,
  OAuthError,
  TokenError,
  PopupError,
} from "./errors/connect-errors";

// Storage exports
export { BrowserTokenStorage } from "./storage/token-storage";
export { MemoryTokenStorage } from "./storage/memory-storage";

// Utility exports
export { parseConnectCallback, isConnectCallback } from "./utils/redirect";
export { logger } from "./utils/logger";
