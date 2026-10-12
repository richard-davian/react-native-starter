import { setAccessToken, setUnauthorizedHandler } from "@/lib/api";
import { tokenStorage, userStorage } from "@/lib/token-storage";
import {
  login,
  register,
  type AuthResult,
  type LoginInput,
  type RegisterInput,
  type User,
} from "@/services/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Parse JSON dengan aman: data rusak -> null, bukan crash
function parseUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    setToken(null);
    setUser(null);
    await Promise.all([tokenStorage.remove(), userStorage.remove()]);
  }, []);

  // Daftarkan handler 401 (logout otomatis)
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [signOut]);

  // Restore sesi saat app dibuka
  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          tokenStorage.get(),
          userStorage.get(),
        ]);
        const parsedUser = parseUser(savedUser);
        if (savedToken && parsedUser) {
          setAccessToken(savedToken);
          setToken(savedToken);
          setUser(parsedUser);
        } else {
          // Sesi tidak lengkap (mis. sesi lama tanpa data user) -> bersihkan
          await Promise.all([tokenStorage.remove(), userStorage.remove()]);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Simpan sesi ke storage, memori request, dan state (dipakai signIn & signUp)
  const persistSession = useCallback(
    async ({ token: t, user: u }: AuthResult) => {
      await Promise.all([
        tokenStorage.set(t),
        userStorage.set(JSON.stringify(u)),
      ]);
      setAccessToken(t);
      setUser(u);
      setToken(t); // terakhir: memicu guard pindah ke (app) saat user sudah siap
    },
    [],
  );

  const signIn = useCallback(
    async (input: LoginInput) => {
      await persistSession(await login(input));
    },
    [persistSession],
  );

  const signUp = useCallback(
    async (input: RegisterInput) => {
      await persistSession(await register(input));
    },
    [persistSession],
  );

  const value = useMemo(
    () => ({ token, user, isLoading, signIn, signUp, signOut }),
    [token, user, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
