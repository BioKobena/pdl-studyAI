// src/lib/api/user.ts

//utilise auth: true pour ajouter le header Authorization automatiquement
import { http } from "../api/http";

export type Me = { id: string; email: string; fullName: string };

export async function getMe() {
  return http<Me>("/api/users/me", { method: "GET", auth: true });
}
