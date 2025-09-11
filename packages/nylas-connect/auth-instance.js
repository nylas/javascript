import { NylasConnect } from "./src/index.ts";

// Shared auth configuration
export const auth = new NylasConnect({
  clientId: "3531f8b3-3d7f-4412-a073-2d4aa397508f",
  apiUrl: "https://api-staging.us.nylas.com/v3",
  redirectUri:
    (globalThis.window?.location?.origin || "http://localhost:3000") +
    "/callback.html",
  provider: "google",
});
