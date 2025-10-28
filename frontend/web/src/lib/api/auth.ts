// src/lib/api/auth.ts
import { http } from "./http";

// ---------- Types ----------
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginSuccess {
  id: string;
  email: string;
  fullName: string;
}
export interface LoginError {
  error: string;
}
export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}
export interface SignupResponse {
  message?: string;
  error?: string;
}

// ---------- API calls ----------
export async function login(payload: LoginRequest) {
  const res = await http<LoginSuccess | LoginError>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res; // pas de setToken ici: le back n’envoie pas encore de JWT
}

export async function signup(payload: SignupRequest) {
  return http<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
