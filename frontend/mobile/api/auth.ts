import { api } from "./client";
import { storage } from "../api/storage/token";

/** Types alignés sur ton AuthController */
export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

export type LoginResponse = AuthUser & {
  token: string;
};

export type SignupResponse = {
  message: string; // "Utilisateur créé"
};

/** LOGIN : appelle le backend + stocke token + user */
export async function login(email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", { email, password });

  // Stockage sécurisé
  await storage.setAccessToken(data.token);
  await storage.setUser({ id: data.id, email: data.email, fullName: data.fullName });

  return { id: data.id, email: data.email, fullName: data.fullName };
}

/** SIGNUP : crée un compte (ne connecte pas automatiquement) */
export async function signup(fullName: string, email: string, password: string): Promise<SignupResponse> {
  const { data } = await api.post<SignupResponse>("/api/auth/signup", {
    fullName,
    email,
    password,
  });
  return data;
}

/** LOGOUT : supprime token + user */
export async function logout(): Promise<void> {
  await storage.clearAll();
}

/** Récupérer l’utilisateur stocké (si besoin dans l’app) */
export async function getStoredUser(): Promise<AuthUser | null> {
  return storage.getUser<AuthUser>();
}

/** Savoir si on est connecté (token présent) */
export async function isAuthenticated(): Promise<boolean> {
  const token = await storage.getAccessToken();
  return !!token;
}
