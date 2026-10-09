import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const isWeb = Platform.OS === "web";

const store = {
  get: async (key: string) =>
    isWeb ? localStorage.getItem(key) : SecureStore.getItemAsync(key),
  set: async (key: string, value: string) => {
    if (isWeb) localStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  },
  remove: async (key: string) => {
    if (isWeb) localStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  },
};

export const tokenStorage = {
  get: () => store.get(TOKEN_KEY),
  set: (v: string) => store.set(TOKEN_KEY, v),
  remove: () => store.remove(TOKEN_KEY),
};

export const userStorage = {
  get: () => store.get(USER_KEY),
  set: (v: string) => store.set(USER_KEY, v),
  remove: () => store.remove(USER_KEY),
};
