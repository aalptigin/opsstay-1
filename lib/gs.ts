// lib/gs.ts
export type User = {
  email: string;
  role: string;
  restaurant: string;
  full_name: string;
};

const TOKEN_KEY = "opsstay_token";
const USER_KEY = "opsstay_user";

export const authStore = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },

  clear() {
    this.clearToken();
    this.clearUser();
  },
};

function getEnv(name: string): string | undefined {
  // Next build’de server/client ayrımı yüzünden güvenli şekilde çekiyoruz
  return (process.env as any)?.[name];
}

export async function gsCall<T>(
  action: string,
  payload: Record<string, any> = {},
  token?: string | null
): Promise<T> {
  const GS = getEnv("NEXT_PUBLIC_GS_WEBAPP_URL") || getEnv("GS_WEBAPP_URL");
  const KEY = getEnv("NEXT_PUBLIC_GS_API_KEY") || getEnv("GS_API_KEY");

  if (!GS || !KEY) {
    throw new Error("ENV_missing");
  }

  const gsUrl = GS.includes("/exec") ? GS : `${GS.replace(/\/$/, "")}/exec`;
  const url = `${gsUrl}?key=${encodeURIComponent(KEY)}`;

  const body = {
    action,
    ...payload,
    // Eğer token gerekiyorsa payload’a ekleyebilirsin (server tarafında kontrol edeceksen)
    token: token || undefined,
  };

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await r.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!r.ok || !data) {
    throw new Error("GS_bad_response");
  }
  if (!data.ok) {
    throw new Error(data.error || "GS_error");
  }

  return data as T;
}
