import { describe, it, expect } from "vitest";
import { generatePKCE, generateState } from "./pkce";

describe("PKCE helpers", () => {
  it("generateState returns a url-safe string of reasonable length", () => {
    const s = generateState();
    expect(typeof s).toBe("string");
    expect(s.length).toBeGreaterThanOrEqual(16);
    expect(/^[A-Za-z0-9\-._~]+$/.test(s)).toBe(true);
  });

  it("generatePKCE returns verifier and challenge", async () => {
    const pair = await generatePKCE();
    expect(pair.codeVerifier).toBeDefined();
    expect(pair.codeChallenge).toBeDefined();
    expect(pair.codeVerifier.length).toBeGreaterThan(30);
    expect(/^[A-Za-z0-9\-._~]+$/.test(pair.codeVerifier)).toBe(true);
    expect(/^[A-Za-z0-9\-_]+$/.test(pair.codeChallenge)).toBe(true);
  });
});
