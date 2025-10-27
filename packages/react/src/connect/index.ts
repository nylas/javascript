// Auto-load CSS styles
import "./NylasConnectButton.css";

// React hook for Nylas connection
export { useNylasConnect } from "./useNylasConnect";

// Export NylasConnectButton component
export { NylasConnectButton } from "./NylasConnectButton";

// Export all auth-related types
export * from "./types";

// Re-export core classes from @nylas/connect for convenience
export { NylasConnect } from "@nylas/connect";
export {
  NylasConnectError,
  ConfigError,
  NetworkError,
  OAuthError,
  TokenError,
  PopupError,
} from "@nylas/connect";
export { BrowserTokenStorage, MemoryTokenStorage } from "@nylas/connect";
export {
  parseConnectCallback,
  isConnectCallback,
  logger,
} from "@nylas/connect";
