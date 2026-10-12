import { api, ApiError } from "@/lib/api";
import { z } from "zod";

// ---------- Tipe bersama ----------
export type User = { id: string; name: string; email: string };
export type AuthResult = { token: string; user: User };

// ---------- Login ----------
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Must be at least 8 characters"),
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
    throw new ApiError(401, "Incorrect email or password");
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
    name: z.string().trim().min(2, "Must be at least 2 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
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

// ---------- Forgot password ----------
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<void> {
  // Mode mock selama backend belum ada
  if (!process.env.EXPO_PUBLIC_API_URL) {
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  // Sesuaikan path dengan backend klien
  await api<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
