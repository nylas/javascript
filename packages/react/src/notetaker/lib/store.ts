import { create } from "zustand";

export interface ProviderStore {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  getAccessToken: () => string;
}

export const provider = create<ProviderStore>((set) => ({
  apiUrl: "https://api.us.nylas.com",
  setApiUrl: (url: "us" | "eu" | string = "us") => {
    let apiUrl = "";
    if (url === "us") {
      apiUrl = "https://api.us.nylas.com";
    } else if (url === "eu") {
      apiUrl = "https://api.eu.nylas.com";
    } else if (typeof url === "string" && url.startsWith("http")) {
      apiUrl = url;
    } else {
      console.error(
        "Invalid API URL provided to the Nylas provider component, url falls back to US api endpoint.",
        url,
      );
      // fallback to default or throw error
      apiUrl = "https://api.us.nylas.com";
    }
    set({ apiUrl });
  },
  getAccessToken: () => {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem("nylas-access-token") || ""
      : "";
  },
}));
