import axios from "axios";

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE || "")
    : (process.env.API_BASE || "https://myrahbar-backend.onrender.com");

const instance = axios.create({
  baseURL: typeof window !== "undefined" ? "/api" : `${API_BASE}/api`,
  withCredentials: true,
});

export default instance;
