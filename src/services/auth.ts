import { api, ApiError } from "@/lib/api";
import { z } from "zod";

// ---------- Tipe bersama ----------
export type User = { id: string; name: string; email: string };
export type AuthResult = { token: string; user: User };

// ---------- Login ----------
export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export async function login(input: LoginInput): Promise<AuthResult> {
  // Mode mock selama backend belum ada: demo@demo.com / password123
  if (!process.env.EXPO_PUBLIC_API_URL) {
    await new Promise((r) => setTimeout(r, 600));
    if (input.email === "demo@demo.com" && input.password === "password123") {
      return {
        token: "mock-token",
        user: { id: "1", name: "Demo User", email: input.email },
      };
    }
    throw new ApiError(401, "Email atau password salah");
  }
  // Sesuaikan path & bentuk response dengan backend klien
  return api<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ---------- Register ----------
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Minimal 2 karakter"),
    email: z.string().trim().email("Email tidak valid"),
    password: z.string().min(8, "Minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export async function register(input: RegisterInput): Promise<AuthResult> {
  // Mode mock selama backend belum ada
  if (!process.env.EXPO_PUBLIC_API_URL) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      token: "mock-token",
      user: { id: "1", name: input.name, email: input.email },
    };
  }
  const { confirmPassword: _omit, ...payload } = input; // jangan kirim confirmPassword
  return api<AuthResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
