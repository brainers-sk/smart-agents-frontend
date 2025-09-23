// client.ts
import axios from "axios";
import qs from "qs";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/login"); // ⬅️ clean redirect
    }
    return Promise.reject(err);
  }
);
