import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "access_token" as const;
const USER_KEY = "auth_user" as const;

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

  clearAll: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
};
