// Minimal polyfills for tests
import { webcrypto as nodeWebcrypto } from "node:crypto";

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", { value: nodeWebcrypto });
}

// Polyfill btoa/atob if missing (Node)
if (typeof globalThis.btoa !== "function") {
  globalThis.btoa = (data: string) =>
    Buffer.from(data, "binary").toString("base64");
}
if (typeof globalThis.atob !== "function") {
  globalThis.atob = (data: string) =>
    Buffer.from(data, "base64").toString("binary");
}
