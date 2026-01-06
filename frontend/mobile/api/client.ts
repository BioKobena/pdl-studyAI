import axios from "axios";
import { storage } from "../api/storage/token";

const API_BASE_URL = "http:/192.168.236.61:8085"; // IP Mac + port backend (PAS localhost)

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

// Ajoute automatiquement le JWT dans chaque requête
api.interceptors.request.use(async (config) => {
  const token = await storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si token invalide/expiré -> on nettoie (pas de refresh dans ton backend)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      await storage.clearAll();
      // La redirection vers login se fait dans l’UI (expo-router)
    }
    return Promise.reject(error);
  }
);
