import axios from "axios";
import { provider } from "./store";
const client = axios.create();

client.interceptors.request.use((req) => {
  const state = provider.getState();
  req.baseURL = state.apiUrl;
  const token = state.getAccessToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default client;
