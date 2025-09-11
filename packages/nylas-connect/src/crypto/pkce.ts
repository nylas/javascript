import type { PKCEPair } from "../types";

/**
 * Generate PKCE code verifier and challenge pair
 * Uses restricted character set for compatibility with Nylas servers
 * and pkce-challenge package for challenge generation
 */
export async function generatePKCE(): Promise<PKCEPair> {
  const codeVerifier = generateRandomString(64);
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  const sha256Hash = Array.from(hashArray, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const codeChallenge = btoa(sha256Hash)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return { codeVerifier, codeChallenge };
}

/**
 * Generate a cryptographically secure random string
 * Uses only URL-safe base64 characters for PKCE compatibility (no dots or tildes)
 */
function generateRandomString(length: number): string {
  // Use RFC 7636 compliant character set for PKCE code verifier
  // Must include unreserved characters: A-Z, a-z, 0-9, -, ., _, ~
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => charset[byte % charset.length]).join("");
}

/**
 * Generate a secure random state parameter
 */
export function generateState(): string {
  return generateRandomString(32);
}
