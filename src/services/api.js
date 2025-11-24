import axios from "axios";

// Base URL del backend (la toma del .env o usa localhost por defecto)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
});

// Middleware global para manejar token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.warn("Token expirado, redirigiendo al login...");

      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
