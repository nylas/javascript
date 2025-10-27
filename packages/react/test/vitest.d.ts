import "vitest";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
}

declare global {
  namespace Chai {
    interface Assertion extends TestingLibraryMatchers<any, void> {}
  }
}
