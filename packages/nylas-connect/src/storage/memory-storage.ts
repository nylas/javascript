import type { TokenStorage } from "../types";

/**
 * In-memory fallback implementation of TokenStorage
 * Used when localStorage is not available
 */
export class MemoryTokenStorage implements TokenStorage {
  private store = new Map<string, string>();

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

/**
 * Create appropriate storage instance based on environment
 */
export async function createStorage(): Promise<TokenStorage> {
  try {
    // Test localStorage availability
    if (globalThis.window?.localStorage) {
      const testKey = "__nylas_auth_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);

      // Import dynamically to avoid issues in non-browser environments
      const { BrowserTokenStorage } = await import("./token-storage");
      return new BrowserTokenStorage();
    }
  } catch (error) {
    // localStorage not available or blocked
  }

  // Fallback to memory storage
  return new MemoryTokenStorage();
}
