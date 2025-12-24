// lib/gs.ts
export type GSUser = {
  email: string;
  full_name: string;
  role: string;
  restaurant: string;
};

const BASE = process.env.NEXT_PUBLIC_GS_WEBAPP_URL!;
const API_KEY = process.env.NEXT_PUBLIC_GS_API_KEY!;
const SHOW = process.env.NEXT_PUBLIC_SHOW_LOGIN_INFO === "true";

export function dbg(...args: any[]) {
  if (SHOW) console.log("[GS]", ...args);
}

export async function gsCall<T>(
  action: string,
  data?: any,
  token?: string
): Promise<T> {
  if (!BASE) throw new Error("NEXT_PUBLIC_GS_WEBAPP_URL boş");
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      key: API_KEY,
      action,
      token: token || null,
      data: data || null,
    }),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(text);
  }
  if (!res.ok || json?.ok === false) throw new Error(json?.error || "GS error");
  return json;
}

export const authStore = {
  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("opssstay_token");
  },
  setToken(t: string) {
    localStorage.setItem("opssstay_token", t);
  },
  clear() {
    localStorage.removeItem("opssstay_token");
    localStorage.removeItem("opssstay_user");
  },
  setUser(u: GSUser) {
    localStorage.setItem("opssstay_user", JSON.stringify(u));
  },
  getUser(): GSUser | null {
    const s = typeof window === "undefined" ? null : localStorage.getItem("opssstay_user");
    if (!s) return null;
    try { return JSON.parse(s); } catch { return null; }
  },
};
