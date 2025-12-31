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
  token: string;
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

// ---------- Utils ----------
function isBrowser() {
  return typeof window !== "undefined";
}

function friendlyLoginError(err: unknown): string {
  // erreurs réseau (backend down / offline / CORS)
  if (err instanceof TypeError) {
    return "Impossible de contacter le serveur. Vérifiez votre connexion.";
  }

  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  // cas fréquents (selon ton wrapper http)
  if (lower.includes("401") || lower.includes("unauthorized")) {
    return "Email ou mot de passe incorrect.";
  }
  if (lower.includes("403") || lower.includes("forbidden")) {
    return "Accès refusé.";
  }
  if (lower.includes("500")) {
    return "Erreur serveur. Réessayez plus tard.";
  }
  if (lower.includes("credentials") || lower.includes("invalid")) {
    return "Email ou mot de passe incorrect.";
  }

  return "Connexion impossible. Vérifiez vos informations.";
}

function clearClientStorage() {
  if (!isBrowser()) return;

  try {
    // ✅ sessionStorage : PDF / subject
    sessionStorage.removeItem("activeSubjectId");
    sessionStorage.removeItem("activePdfText");

    // anciens noms éventuels
    sessionStorage.removeItem("SubjectId");
    sessionStorage.removeItem("userId");

    // purge des keys par préfixes (pdfText:<key>, subjectId:<key>, etc.)
    const ssKeys = Object.keys(sessionStorage);
    for (const k of ssKeys) {
      if (
        k.startsWith("pdfText:") ||
        k.startsWith("pdfName:") ||
        k.startsWith("pdfBlobUrl:") ||
        k.startsWith("pdfMeta:") ||
        k.startsWith("subjectId:")
      ) {
        sessionStorage.removeItem(k);
      }
    }

    // ✅ localStorage : auth + user
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userid");
    localStorage.removeItem("current_user");
    localStorage.removeItem("SubjectId");
  } catch (e) {
    console.error("clearClientStorage error:", e);
  }
}

// ---------- API calls ----------

// LOGIN
export async function login(payload: LoginRequest) {
  try {
    // le back renvoie 200 avec {id, email, fullName, token}
    const res = await http<LoginSuccess>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!isBrowser()) return res;

    // garde une seule convention : userId
    localStorage.setItem("userId", res.id);

    // on sauvegarde le token pour les requêtes protégées
    if (res.token) {
      setToken(res.token); // ton http client
      // si tu utilises aussi auth_token dans d'autres fetch:
      localStorage.setItem("auth_token", res.token);

      saveUser({ id: res.id, email: res.email, fullName: res.fullName });
    }

    return res;
  } catch (err) {
    // ⛔ important: on renvoie une erreur “propre” pour l’UI
    throw new Error(friendlyLoginError(err));
  }
}

// SIGNUP
export async function signup(payload: SignupRequest) {
  return http<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// LOGOUT (frontend)
export function logout() {
  if (!isBrowser()) return;

  // ✅ reset token côté client
  // (si setToken accepte null chez toi, mets setToken(null as any))
  setToken("");

  // ✅ purge storage
  clearClientStorage();
}
