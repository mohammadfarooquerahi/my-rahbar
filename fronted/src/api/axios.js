import axios from "axios";

// VULN-16 FIX: Use relative /api path which works with Vite proxy (dev) and Vercel rewrites (prod)
axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;
