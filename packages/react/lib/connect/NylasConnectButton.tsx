import React, { useCallback } from "react";
import type { CSSProperties, ReactNode } from "react";
import type {
  Provider,
  NylasScope,
  ConnectResult as AuthResult,
  IdentityProviderTokenCallback,
  CodeExchangeMethod,
} from "@nylas/connect";
import { useNylasConnect } from "./useNylasConnect";

export type NylasConnectButtonProps = {
  clientId: string;
  redirectUri?: string;
  apiUrl?: string;
  defaultScopes?: NylasScope[]; // optional override
  persistTokens?: boolean;

  method?: "popup" | "inline";
  provider?: Provider;
  scopes?: NylasScope[];
  loginHint?: string;
  popupWidth?: number;
  popupHeight?: number;

  text?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;

  // Styling controls
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  unstyled?: boolean;
  cssVars?: Partial<
    Record<
      | "--nylas-btn-bg"
      | "--nylas-btn-fg"
      | "--nylas-btn-border"
      | "--nylas-btn-bg-hover",
      string
    >
  >;

  // Advanced configuration
  /**
   * Optional callback to provide external identity provider JWT token.
   * Called during token exchange to include IDP claims.
   * Return null to skip IDP claims, or throw to fail authentication.
   */
  identityProviderToken?: IdentityProviderTokenCallback;

  /**
   * Custom code exchange method for backend-based token exchange.
   * Allows handling OAuth code exchange on your server instead of the browser.
   */
  codeExchange?: CodeExchangeMethod;

  onStart?: () => void;
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: Error) => void;
  onCancel?: (reason: string) => void;
  children?: ReactNode;
};

export function NylasConnectButton({
  clientId,
  redirectUri,
  apiUrl,
  defaultScopes,
  persistTokens,

  method = "inline",
  provider,
  scopes,
  loginHint,
  popupWidth,
  popupHeight,

  text = "Connect your inbox",
  className,
  style,
  disabled,
  // styling
  variant = "primary",
  size = "md",
  unstyled = false,
  cssVars,

  // advanced config
  identityProviderToken,
  codeExchange,

  onStart,
  onSuccess,
  onError,
  onCancel,
  children,
}: NylasConnectButtonProps) {
  const { connect, isLoading } = useNylasConnect({
    clientId,
    redirectUri,
    apiUrl,
    // Only pass defaultScopes if caller provides it to override defaults
    ...(defaultScopes ? { defaultScopes } : {}),
    persistTokens,
    autoHandleCallback: true,
    identityProviderToken,
    codeExchange,
  });

  const handleClick = useCallback(async () => {
    try {
      onStart?.();
      const resultOrUrl = await connect({
        method,
        provider,
        scopes,
        loginHint,
        popupWidth,
        popupHeight,
      });

      if (typeof resultOrUrl === "string") {
        window.location.assign(resultOrUrl);
        return;
      }

      onSuccess?.(resultOrUrl);
    } catch (err) {
      const message = (err as Error)?.message || "";
      if (message.includes("closed") || message.includes("cancelled")) {
        onCancel?.(message);
        return;
      }
      onError?.(err as Error);
    }
  }, [
    connect,
    method,
    provider,
    scopes,
    loginHint,
    popupWidth,
    popupHeight,
    onStart,
    onSuccess,
    onCancel,
    onError,
  ]);

  const rootClassName = unstyled
    ? className
    : ["nylas-btn", `nylas-btn--${variant}`, `nylas-btn--${size}`, className]
        .filter(Boolean)
        .join(" ");

  const styleWithVars: CSSProperties | undefined = cssVars
    ? { ...(cssVars as CSSProperties), ...style }
    : style;

  return (
    <button
      type="button"
      className={rootClassName}
      style={styleWithVars}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      onClick={handleClick}
    >
      {children ?? text}
    </button>
  );
}
