// src/lib/api/auth.ts
import { http, setToken } from "./http";
import { saveUser } from "../session";

// ---------- Types ----------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccess {
  id: string;
  email: string;
  fullName: string;
  token: string; // <-- nouveau
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

// LOGIN
export async function login(payload: LoginRequest) {
  // le back renvoie 200 avec {id, email, fullName, token}
  const res = await http<LoginSuccess>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("userId",res.id);


  // on sauvegarde le token pour les requêtes protégées
  if (res.token) {
    setToken(res.token);
    saveUser({ id: res.id, email: res.email, fullName: res.fullName });
  }

  return res;
}

// SIGNUP
export async function signup(payload: SignupRequest) {
  return http<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
