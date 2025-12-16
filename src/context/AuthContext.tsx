import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import type { User } from "../types";
import { loginUser, registerUser } from "../services/api";

const STORAGE_KEY = "currentUser";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sanitizeUser = (u: any): User => ({
    email: String(u?.email ?? ""),
    name: String(u?.name ?? ""),
    country: u?.country ? String(u.country) : undefined,
  });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          const restored = sanitizeUser(parsed);
          if (restored.email && restored.name) {
            setUser(restored);
          } else {
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await loginUser(email, password);
      const sanitized = sanitizeUser(loggedInUser);
      setUser(sanitized);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (e: any) {
      Alert.alert(
        "로그인 실패",
        e?.message || "이메일 또는 비밀번호가 올바르지 않습니다."
      );
      return false;
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      const registeredUser = await registerUser(email, name, password);
      const sanitized = sanitizeUser(registeredUser);
      setUser(sanitized);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (e: any) {
      Alert.alert(
        "회원가입 실패",
        e?.message || "이미 존재하는 이메일이거나 오류가 발생했습니다."
      );
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
