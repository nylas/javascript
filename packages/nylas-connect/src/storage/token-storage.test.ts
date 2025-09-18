import { describe, it, expect, beforeEach } from "vitest";
import { MemoryTokenStorage, createStorage } from "./memory-storage";

describe("Token storage", () => {
  beforeEach(() => {
    // ensure clean environment
    delete globalThis.window;
  });

  it("MemoryTokenStorage stores, retrieves, removes, and clears", async () => {
    const storage = new MemoryTokenStorage();
    await storage.set("a", "1");
    expect(await storage.get("a")).toBe("1");
    await storage.remove("a");
    expect(await storage.get("a")).toBeNull();
    await storage.set("b", "2");
    await storage.set("c", "3");
    await storage.clear();
    expect(await storage.get("b")).toBeNull();
    expect(await storage.get("c")).toBeNull();
  });

  it("createStorage falls back to memory when window/localStorage missing", async () => {
    const storage = await createStorage();
    // Should be memory fallback
    await storage.set("k", "v");
    expect(await storage.get("k")).toBe("v");
  });
});
