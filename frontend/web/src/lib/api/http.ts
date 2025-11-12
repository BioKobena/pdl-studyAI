// src/lib/api/http.ts
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!RAW_BASE) {
  console.warn(
    "[http.ts] NEXT_PUBLIC_API_BASE_URL est vide. " +
      "Revois ton .env.local et redémarre `npm run dev`.",
  );
}

// 1) Lis la variable d'environnement depuis .env (Next.js => NEXT_PUBLIC_*), et enlève les / à la finr
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");

// 2) Gestion token (simple localStorage)
const TOKEN_KEY = "auth_token"; //TOKEN_KEY est l'endroit ou on range le token dans le navigateur
export const getToken = () =>
  //permet de recupérer la valeur du token enregistré sous le non de auth_token
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
export const setToken = (t: string | null) => {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY); // supprime le token lorsqu'on se déconnecte,
};

// 3) Wrapper fetch
export async function http<T>( //T veut dire que la fonction peut retourner n'importe quel type de reponse
  path: string, //le chemin de la requette
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`; // construction de l'url

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  }; //permet de stocker les informations d'en tête, c'est comme  ecrire l'etiquette du colis qu'on envoie

  // Ajoute Content-Type JSON si body stringifié et que le type n'a pas été spécifié
  if (!headers["Content-Type"] && typeof init?.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  // sert à ajouter le token au header avant d'envoyer la requete , car cette requête peut necessité que la personne soit déjà connecté d'ou l'ajout du token dan sle header
  if (init?.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  // avec fetch, on envoie une requêtte http vers le serveur
  //composé de l'url et du message ( composé de la method (POST etc),le body(email,password), le headers (tyoe du message et token))
  const res = await fetch(url, { ...init, headers });
  //await: sert à attendre que le serveur nous renvoie une reponse avant de continuer

  //reponse donné par le serveur
  if (res.status === 401) {
    // token expiré → on nettoie
    setToken(null);
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const text = await res.text();
      message = text || message;
    } catch {}
    throw new Error(message); // "Mauvais mot de passe" par exemple
  }

  if (res.status === 204) return undefined as unknown as T;
  if (res.status === 401) {
    setToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login"; // <<< ajoute ceci
    }
  }

  // res.json() -> permet de lire la reponse sous forme de données utilisables
  const isJson = res.headers.get("content-type")?.includes("application/json");
  return (isJson ? res.json() : res.text()) as Promise<T>;
}
