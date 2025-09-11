import type { TokenStorage } from "../types";

/**
 * Browser localStorage implementation of TokenStorage
 */
export class BrowserTokenStorage implements TokenStorage {
  private prefix = "@nylas/connect:";

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (error) {
      throw new Error(`Failed to store value: ${error}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch (error) {
      throw new Error(`Failed to retrieve value: ${error}`);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      throw new Error(`Failed to remove value: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.prefix),
      );
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }
}
