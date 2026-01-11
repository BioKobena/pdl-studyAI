import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "access_token" as const;
const USER_KEY = "auth_user" as const;

//sert à décider où rediriger au lancement
const SESSION_ACTIVE_KEY = "session_active" as const;

const SUBJECTS_CACHE_PREFIX = "subjects_cache_" as const;

export type CachedSubject = {
  id: string;
  userId: string;
  title: string;
};

/** Utilitaire interne : enlever guillemets/espaces sur des valeurs stockées */
function normalizeString(v: string) {
  return v.replace(/^"|"$/g, "").trim();
}

/** Utilitaire interne : lecture JSON safe depuis AsyncStorage */
async function safeGetJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Bonus (optionnel) : lecture exp d’un JWT si possible.
 * Si atob/Buffer n’existe pas, on ignore (on ne bloque pas l’app).
 */
function safeAtob(input: string): string | null {
  const atobFn = (globalThis as any)?.atob;
  if (typeof atobFn === "function") return atobFn(input);

  const BufferAny = (globalThis as any)?.Buffer;
  if (BufferAny?.from) {
    try {
      return BufferAny.from(input, "base64").toString("utf8");
    } catch {
      return null;
    }
  }
  return null;
}

function getJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = safeAtob(base64);
    if (!decoded) return null;

    const json = JSON.parse(decoded);
    return typeof json?.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const exp = getJwtExp(token);
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= exp;
}

export const storage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_KEY),
  setAccessToken: (v: string) => SecureStore.setItemAsync(ACCESS_KEY, v),
  delAccessToken: () => SecureStore.deleteItemAsync(ACCESS_KEY),

  getUser: async <T = unknown>() => {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setUser: (u: unknown) => SecureStore.setItemAsync(USER_KEY, JSON.stringify(u)),
  delUser: () => SecureStore.deleteItemAsync(USER_KEY),

  /**
   * récupérer userId de manière robuste
   * (si parfois c’est id / _id / userId selon backend)
   */
  getUserId: async () => {
    const user = await storage.getUser<any>();
    const id = user?.id ?? user?._id ?? user?.userId;
    return typeof id === "string" ? normalizeString(id) : null;
  },

  /**
   * header Authorization prêt à l’emploi
   * Retourne "Bearer <token>" ou null si pas connecté
   */
  getAuthHeader: async () => {
    const t = await storage.getAccessToken();
    if (!t) return null;
    const token = normalizeString(t);
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  },

  // ---------------- AsyncStorage (non sensible) ----------------

  /**
   * Marque la session comme active/inactive.
   * (utilisé pour savoir où rediriger au lancement de l’app)
   */
  setSessionActive: async (active: boolean) => {
    if (active) await AsyncStorage.setItem(SESSION_ACTIVE_KEY, "1");
    else await AsyncStorage.removeItem(SESSION_ACTIVE_KEY);
  },

  /**
   * Retourne true si une session était active (flag),
   * mais la vraie vérif doit être faite avec verifySession().
   */
  isSessionActive: async () => {
    const v = await AsyncStorage.getItem(SESSION_ACTIVE_KEY);
    return v === "1";
  },

  /**
   * Vérification centrale au démarrage de l’app :
   * - token existe ?
   * - user existe ?
   * - token expiré ? (si lisible)
   * => met à jour SESSION_ACTIVE_KEY
   */
  verifySession: async () => {
    const tokenRaw = await SecureStore.getItemAsync(ACCESS_KEY);
    const userRaw = await SecureStore.getItemAsync(USER_KEY);

    if (!tokenRaw || !userRaw) {
      await AsyncStorage.removeItem(SESSION_ACTIVE_KEY);
      return { ok: false as const };
    }

    const token = normalizeString(tokenRaw);

    // si tu veux gérer l’expiration (optionnel)
    if (isExpired(token)) {
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
        AsyncStorage.removeItem(SESSION_ACTIVE_KEY),
      ]);
      return { ok: false as const };
    }

    await AsyncStorage.setItem(SESSION_ACTIVE_KEY, "1");
    return { ok: true as const };
  },

  // ---------------- Cache Subjects ----------------

  /**Récupère le cache des subjects pour un user*/
  getCachedSubjects: async (userId: string): Promise<CachedSubject[]> => {
    const key = `${SUBJECTS_CACHE_PREFIX}${userId}`;
    const list = await safeGetJson<CachedSubject[]>(key);
    return Array.isArray(list) ? list : [];
  },

  /**Écrase le cache subjects (après un refresh API) */
  setCachedSubjects: async (userId: string, subjects: CachedSubject[]) => {
    const key = `${SUBJECTS_CACHE_PREFIX}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(subjects ?? []));
  },

  /**
   * Ajoute ou met à jour 1 subject dans le cache
   * À appeler juste après createSubject() pour garder la liste à jour.
   */
  upsertCachedSubject: async (userId: string, subject: CachedSubject) => {
    const prev = await storage.getCachedSubjects(userId);
    const next = [subject, ...prev.filter((s) => s.id !== subject.id)];
    await storage.setCachedSubjects(userId, next);
  },

  /**
   * Supprime le cache des subjects d’un user
   * (utile au logout)
   */
  clearCachedSubjects: async (userId: string) => {
    const key = `${SUBJECTS_CACHE_PREFIX}${userId}`;
    await AsyncStorage.removeItem(key);
  },

  /**
   * (Garde ton clearAll existant : token + user seulement)
   */
  clearAll: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },

  /**
   * ✅ clear complet recommandé au logout
   * - supprime token + user (SecureStore)
   * - supprime cache subjects (AsyncStorage)
   * - supprime flag session_active
   */
  clearAllLogout: async () => {
    const userId = await storage.getUserId();

    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
      AsyncStorage.removeItem(SESSION_ACTIVE_KEY),
    ]);

    if (userId) {
      await storage.clearCachedSubjects(userId);
    }
  },
};
