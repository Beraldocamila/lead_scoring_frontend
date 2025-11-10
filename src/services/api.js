import axios from "axios";

// Base URL del backend (la toma del .env o usa localhost por defecto)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
});



export default api;
