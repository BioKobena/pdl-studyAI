import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ACCESS_KEY = "access_token" as const;
const USER_KEY = "auth_user" as const;


const SUBJECTS_CACHE_PREFIX = "subjects_cache_" as const;

/**
 * ✅ Structure minimale d’un subject qu’on garde en cache local.
 * (pas de extractText ici, on cache juste ce qui sert à afficher une liste)
 */
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


  /**Récupère le cache des subjects pour un user*/
  getCachedSubjects: async (userId: string): Promise<CachedSubject[]> => {
    const key = `${SUBJECTS_CACHE_PREFIX}${userId}`;
    const list = await safeGetJson<CachedSubject[]>(key);
    return Array.isArray(list) ? list : [];
  },

  /**Écrase le cache subjects (après un refresh API)
   */
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
  clearAll: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
   /**
   * clear complet recommandé au logout
   * - supprime token + user (SecureStore)
   * - supprime aussi le cache subjects (AsyncStorage)
   */
  clearAllLogout: async () => {
    const userId = await storage.getUserId();
    await storage.clearAll(); // garde ton clear existant
    if (userId) {
      await storage.clearCachedSubjects(userId);
    }
  },
};
