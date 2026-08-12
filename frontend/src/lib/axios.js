import axios from "axios";
import { getAccountKey, getTrack } from "./account";
// we will create an axios instance

// Use an explicit override when present; otherwise match the backend dev port.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "/api");

// const axiosInstance or const api same thing
const api = axios.create({
  baseURL: BASE_URL,
});

// The account key only rides along when the buyer is actually standing at the
// wholesale door. Browsing the consumer catalogue returns consumer pricing,
// even for an approved trade account.
api.interceptors.request.use((config) => {
  if (getTrack() === "wholesale") {
    config.headers["x-account-key"] = getAccountKey();
  }
  return config;
});

export default api;
