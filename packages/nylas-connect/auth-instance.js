import { NylasConnect } from "./src/index.ts";

// Shared auth configuration
export const auth = new NylasConnect({
  clientId: "09e06084-b8a4-483c-92e2-07985e0d0489",
  apiUrl: "https://api.us.nylas.com/v3",
  redirectUri:
    (globalThis.window?.location?.origin || "http://localhost:3000") +
    "/callback.html",
  provider: "google",
});
