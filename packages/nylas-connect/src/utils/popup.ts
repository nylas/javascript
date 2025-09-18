import { PopupError } from "../errors/connect-errors";
import { ConnectStatus } from "../types";
import { logger } from "./logger";

/**
 * Popup window configuration
 */
export interface PopupConfig {
  width: number;
  height: number;
  centered?: boolean;
}

/**
 * Default popup configuration
 */
const DEFAULT_POPUP_CONFIG: PopupConfig = {
  width: 500,
  height: 600,
  centered: true,
};

/**
 * Open a popup window for OAuth authentication
 */
export function openPopup(
  url: string,
  config: Partial<PopupConfig> = {},
): Window {
  const finalConfig = { ...DEFAULT_POPUP_CONFIG, ...config };

  // Calculate position for centering
  let left = 0;
  let top = 0;

  if (finalConfig.centered && globalThis.window) {
    left =
      globalThis.window.screenX +
      (globalThis.window.outerWidth - finalConfig.width) / 2;
    top =
      globalThis.window.screenY +
      (globalThis.window.outerHeight - finalConfig.height) / 2.5;
  }

  const features = [
    `width=${finalConfig.width}`,
    `height=${finalConfig.height}`,
    `left=${left}`,
    `top=${top}`,
    "scrollbars=yes",
    "resizable=yes",
    "status=no",
    "toolbar=no",
    "menubar=no",
    "location=no",
  ].join(",");

  logger.debug("Opening popup window", { url, features });

  if (!globalThis.window) {
    throw new PopupError(
      "Popup functionality requires browser environment",
      "Window object is not available. This may be due to server-side rendering or non-browser environment.",
    );
  }

  const popup = globalThis.window.open(url, "nylas-auth-popup", features);

  if (!popup) {
    throw new PopupError(
      "Failed to open popup window",
      "Popup may have been blocked by browser. Please allow popups and try again.",
    );
  }

  return popup;
}

/**
 * Wait for authentication callback in popup
 */
export function waitForCallback(
  popup: Window,
  expectedState: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!globalThis.window) {
      reject(
        new PopupError("Window object not available for message handling"),
      );
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(
          new PopupError("Popup was closed before authentication completed"),
        );
      }
    }, 1000);

    const messageHandler = (event: MessageEvent) => {
      // Verify origin if needed
      logger.debug("Received popup message", event.data);
      if (event.data.type === ConnectStatus.SUCCESS) {
        clearInterval(checkClosed);
        globalThis.window.removeEventListener("message", messageHandler);
        popup.close();

        // Verify state parameter
        if (event.data.state !== expectedState) {
          reject(new PopupError("Invalid state parameter in callback"));
          return;
        }

        if (event.data.code) {
          resolve(event.data.code);
        } else {
          reject(new PopupError("No authorization code received"));
        }
      } else if (event.data.type === ConnectStatus.ERROR) {
        clearInterval(checkClosed);
        globalThis.window.removeEventListener("message", messageHandler);
        popup.close();

        reject(
          new PopupError(
            event.data.error || "Authentication failed",
            event.data.error_description,
          ),
        );
      }
    };

    globalThis.window.addEventListener("message", messageHandler);

    // Fallback timeout
    setTimeout(() => {
      if (!popup.closed) {
        clearInterval(checkClosed);
        globalThis.window.removeEventListener("message", messageHandler);
        popup.close();
        reject(new PopupError("Authentication timeout"));
      }
    }, 300000); // 5 minutes
  });
}

/**
 * Send message from popup to parent window
 * This should be called from the redirect URI page
 */
export function sendPopupMessage(data: any): void {
  if (
    globalThis.window?.opener &&
    globalThis.window.name === "nylas-auth-popup"
  ) {
    logger.debug("Sending message to parent window", data);

    // Check if postMessage is available
    if (typeof globalThis.window.opener.postMessage === "function") {
      globalThis.window.opener.postMessage(
        data,
        globalThis.window.location.origin,
      );
    }
  }
}
