const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAccessToken = (t: string | null): void => {
  accessToken = t;
};

export const setUnauthorizedHandler = (fn: (() => void) | null): void => {
  onUnauthorized = fn;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  // Token kedaluwarsa/invalid -> paksa logout (kecuali saat login itu sendiri)
  if (res.status === 401 && accessToken) onUnauthorized?.();

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.message ?? "Terjadi kesalahan");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
