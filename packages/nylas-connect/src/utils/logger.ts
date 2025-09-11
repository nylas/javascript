/**
 * Smart logger with production-safe defaults
 * - Disabled by default in production
 * - Auto-enables debug mode on localhost/development
 * - Can be manually controlled via environment variables or API
 */

import { LogLevel } from "../types";

interface Logger {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  log(...args: any[]): void; // Alias for info for backward compatibility
  setLevel(level: LogLevel | "off"): void;
  enable(): void;
  disable(): void;
}

class NylasConnectLogger implements Logger {
  private currentLevel: LogLevel | "off";
  private levelPriority: { [key in LogLevel | "off"]: number } = {
    off: -1,
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
  };

  constructor() {
    // Check for debug flag in various environments to set initial level
    this.currentLevel = this.getInitialLevel();
  }

  private getInitialLevel(): LogLevel | "off" {
    // Check for explicit debug flag first (highest priority)
    const explicitDebugFlag = this.getExplicitDebugFlag();
    if (explicitDebugFlag !== null) {
      return explicitDebugFlag ? LogLevel.DEBUG : "off";
    }

    // Auto-enable debug on localhost
    if (this.isLocalhost()) {
      return LogLevel.DEBUG;
    }

    // Default to off (disabled) for production and non-localhost environments
    return "off";
  }

  private getExplicitDebugFlag(): boolean | null {
    // Browser environment
    if (typeof window !== "undefined") {
      // Check localStorage first
      const localStorageFlag = localStorage.getItem("NYLAS_CONNECT_DEBUG");
      if (localStorageFlag !== null) {
        return localStorageFlag === "true";
      }
    }

    // Node.js environment
    if (typeof process !== "undefined" && process.env) {
      const envFlag = process.env.NYLAS_CONNECT_DEBUG;
      if (envFlag !== undefined) {
        return envFlag === "true";
      }
    }

    return null; // No explicit flag set
  }

  private isLocalhost(): boolean {
    // Browser environment
    if (globalThis.window) {
      const hostname = globalThis.window.location.hostname;
      return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname.endsWith(".local")
      );
    }

    // Node.js environment - check for common development indicators
    if (typeof process !== "undefined" && process.env) {
      const nodeEnv = process.env.NODE_ENV;
      const isDev = nodeEnv === "development" || nodeEnv === "dev";
      const hasLocalhost =
        process.env.HOST?.includes("localhost") ||
        process.env.HOSTNAME?.includes("localhost");
      return isDev || hasLocalhost || false;
    }

    return false;
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.currentLevel !== "off" &&
      this.levelPriority[level] >= this.levelPriority[this.currentLevel]
    );
  }

  private formatMessage(level: LogLevel, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [NYLAS-AUTH] [${level.toUpperCase()}]`;

    console[level === LogLevel.DEBUG ? "log" : level](prefix, ...args);
  }

  debug(...args: any[]): void {
    this.formatMessage(LogLevel.DEBUG, ...args);
  }

  info(...args: any[]): void {
    this.formatMessage(LogLevel.INFO, ...args);
  }

  warn(...args: any[]): void {
    this.formatMessage(LogLevel.WARN, ...args);
  }

  error(...args: any[]): void {
    this.formatMessage(LogLevel.ERROR, ...args);
  }

  log(...args: any[]): void {
    // Alias for info to maintain backward compatibility with console.log
    this.formatMessage(LogLevel.INFO, ...args);
  }

  setLevel(level: LogLevel | "off"): void {
    this.currentLevel = level;
  }

  enable(): void {
    // Enable with debug level when explicitly enabled
    this.currentLevel = LogLevel.DEBUG;
  }

  disable(): void {
    this.currentLevel = "off";
  }
}

// Export a singleton instance
export const logger = new NylasConnectLogger();
