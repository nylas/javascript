import React, { createContext, useContext, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * Nylas theme color configuration
 */
export interface NylasThemeColors {
  /** Background color */
  background?: string;
  /** Foreground/text color */
  foreground?: string;
  /** Border color */
  border?: string;
  /** Light border color */
  borderLight?: string;
  /** Muted background color */
  muted?: string;
  /** Muted foreground color */
  mutedFg?: string;
  /** Accent background color */
  accent?: string;
  /** Accent foreground color */
  accentFg?: string;
  /** Primary color */
  primary?: string;
  /** Primary hover color */
  primaryHover?: string;
  /** Primary active color */
  primaryActive?: string;
  /** Primary light background */
  primaryLight?: string;
  /** Primary lighter background */
  primaryLighter?: string;
  /** Success color */
  success?: string;
  /** Success light background */
  successLight?: string;
  /** Warning color */
  warning?: string;
  /** Warning light background */
  warningLight?: string;
  /** Error color */
  error?: string;
  /** Error light background */
  errorLight?: string;
  /** Danger color */
  danger?: string;
  /** Danger hover color */
  dangerHover?: string;
}

/**
 * Nylas theme spacing configuration
 */
export interface NylasThemeSpacing {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
}

/**
 * Nylas theme border radius configuration
 */
export interface NylasThemeBorderRadius {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  full?: string;
}

/**
 * Nylas theme shadow configuration
 */
export interface NylasThemeShadows {
  sm?: string;
  md?: string;
  lg?: string;
  primary?: string;
}

/**
 * Complete Nylas theme configuration
 */
export interface NylasTheme {
  /** Color configuration */
  colors?: NylasThemeColors;
  /** Spacing configuration */
  spacing?: NylasThemeSpacing;
  /** Border radius configuration */
  borderRadius?: NylasThemeBorderRadius;
  /** Shadow configuration */
  shadows?: NylasThemeShadows;
  /** Button-specific colors */
  button?: {
    bg?: string;
    fg?: string;
    border?: string;
    bgHover?: string;
    bgActive?: string;
    primaryBg?: string;
    primaryFg?: string;
    primaryBgHover?: string;
    disabledBg?: string;
    disabledFg?: string;
  };
  /** Input-specific colors */
  input?: {
    bg?: string;
    fg?: string;
    border?: string;
    borderFocus?: string;
    placeholder?: string;
    disabledBg?: string;
    disabledFg?: string;
  };
  /** Transcript-specific colors */
  transcript?: {
    bg?: string;
    border?: string;
    itemBg?: string;
    itemBgHover?: string;
    itemBgActive?: string;
    toolbarBg?: string;
    toolbarBorder?: string;
    timestamp?: string;
    speaker?: string;
    text?: string;
    emptyIcon?: string;
    emptyText?: string;
    highlightBg?: string;
    highlightFg?: string;
  };
}

/**
 * Props for the NylasThemeProvider component
 */
export interface NylasThemeProviderProps {
  /** Theme configuration object */
  theme?: NylasTheme;
  /** Theme mode: 'light', 'dark', or 'system' */
  mode?: "light" | "dark" | "system";
  /** Child components */
  children: ReactNode;
}

// Create the theme context
const NylasThemeContext = createContext<{
  theme?: NylasTheme;
  mode?: "light" | "dark" | "system";
}>({});

/**
 * Converts a theme object to CSS variables
 */
export function themeToCSSVars(theme?: NylasTheme): CSSProperties {
  if (!theme) {
    return {};
  }

  const vars: Record<string, string> = {};

  // Colors
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (value) {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        vars[`--nylas-${cssKey}`] = value;
      }
    });
  }

  // Spacing
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (value) {
        vars[`--nylas-spacing-${key}`] = value;
      }
    });
  }

  // Border radius
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      if (value) {
        vars[`--nylas-radius-${key}`] = value;
      }
    });
  }

  // Shadows
  if (theme.shadows) {
    Object.entries(theme.shadows).forEach(([key, value]) => {
      if (value) {
        vars[`--nylas-shadow-${key}`] = value;
      }
    });
  }

  // Button
  if (theme.button) {
    Object.entries(theme.button).forEach(([key, value]) => {
      if (value) {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        vars[`--nylas-btn-${cssKey}`] = value;
      }
    });
  }

  // Input
  if (theme.input) {
    Object.entries(theme.input).forEach(([key, value]) => {
      if (value) {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        vars[`--nylas-input-${cssKey}`] = value;
      }
    });
  }

  // Transcript
  if (theme.transcript) {
    Object.entries(theme.transcript).forEach(([key, value]) => {
      if (value) {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        vars[`--nylas-transcript-${cssKey}`] = value;
      }
    });
  }

  return vars as CSSProperties;
}

/**
 * Theme provider component for Nylas components.
 * Wraps your app or component tree to provide theme configuration via CSS variables.
 *
 * @example
 * ```tsx
 * import { NylasThemeProvider } from '@nylas/react';
 *
 * function App() {
 *   return (
 *     <NylasThemeProvider
 *       mode="dark"
 *       theme={{
 *         colors: {
 *           primary: '#ff6b6b',
 *           background: '#1a1a1a'
 *         }
 *       }}
 *     >
 *       <YourComponents />
 *     </NylasThemeProvider>
 *   );
 * }
 * ```
 */
export function NylasThemeProvider({
  theme,
  mode = "system",
  children,
}: NylasThemeProviderProps) {
  const cssVars = useMemo(() => themeToCSSVars(theme), [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      mode,
    }),
    [theme, mode],
  );

  // Determine the class name based on mode
  const themeClassName =
    mode === "light"
      ? "nylas-theme-light"
      : mode === "dark"
        ? "nylas-theme-dark"
        : "";

  return (
    <NylasThemeContext.Provider value={contextValue}>
      <div className={themeClassName} style={cssVars}>
        {children}
      </div>
    </NylasThemeContext.Provider>
  );
}

/**
 * Hook to access the current Nylas theme configuration.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, mode } = useNylasTheme();
 *   return <div>Current mode: {mode}</div>;
 * }
 * ```
 */
export function useNylasTheme() {
  return useContext(NylasThemeContext);
}

/**
 * Default light theme configuration
 */
export const defaultLightTheme: NylasTheme = {
  colors: {
    background: "#ffffff",
    foreground: "#111827",
    border: "#e5e7eb",
    borderLight: "#f3f4f6",
    muted: "#f9fafb",
    mutedFg: "#6b7280",
    accent: "#eff6ff",
    accentFg: "#1e40af",
    primary: "#4069e1",
    primaryHover: "#2d4fc7",
    primaryActive: "#253ea3",
    primaryLight: "#f0f4ff",
    primaryLighter: "#e0e9ff",
    success: "#10b981",
    successLight: "#d1fae5",
    warning: "#f59e0b",
    warningLight: "#fef3c7",
    error: "#ef4444",
    errorLight: "#fee2e2",
    danger: "#dc2626",
    dangerHover: "#b91c1c",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    primary: "0 4px 6px -1px rgba(64, 105, 225, 0.2)",
  },
};

/**
 * Default dark theme configuration
 */
export const defaultDarkTheme: NylasTheme = {
  colors: {
    background: "#0a0a0a",
    foreground: "#f9fafb",
    border: "#27272a",
    borderLight: "#1f1f23",
    muted: "#18181b",
    mutedFg: "#a1a1aa",
    accent: "#1e293b",
    accentFg: "#93c5fd",
    primary: "#60a5fa",
    primaryHover: "#3b82f6",
    primaryActive: "#2563eb",
    primaryLight: "#1e3a8a",
    primaryLighter: "#1e40af",
    success: "#34d399",
    successLight: "#064e3b",
    warning: "#fbbf24",
    warningLight: "#78350f",
    error: "#f87171",
    errorLight: "#7f1d1d",
    danger: "#ef4444",
    dangerHover: "#dc2626",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
    primary: "0 4px 6px -1px rgba(96, 165, 250, 0.3)",
  },
};

/**
 * Utility function to merge theme objects
 */
export function mergeThemes(
  base: NylasTheme,
  override: NylasTheme,
): NylasTheme {
  return {
    colors: { ...base.colors, ...override.colors },
    spacing: { ...base.spacing, ...override.spacing },
    borderRadius: { ...base.borderRadius, ...override.borderRadius },
    shadows: { ...base.shadows, ...override.shadows },
    button: { ...base.button, ...override.button },
    input: { ...base.input, ...override.input },
    transcript: { ...base.transcript, ...override.transcript },
  };
}
