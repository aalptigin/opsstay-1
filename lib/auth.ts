import { cookies } from "next/headers";

const COOKIE_NAME = "opssstay_session";

// ✅ Senin SESSION_SECRET (fallback)
const FALLBACK_SESSION_SECRET =
  "zt2nBsnS5wyWazVtJmhFoXpJ+WNvB2R8A8iCtY23vvBrZK8M25Tcu6YogKpYoHGce/7khmm1Qb9UiJGiTQkcYQ";

// --- base64url helpers
function b64urlEncode(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64urlEncodeText(text: string) {
  return b64urlEncode(new TextEncoder().encode(text).buffer);
}
function b64urlDecodeToText(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacSign(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64urlEncode(sig);
}

export type SessionUser = {
  email: string;
  role: string;
  restaurant: string;
  full_name: string;
};

export async function createSession(user: SessionUser) {
  const secret = process.env.SESSION_SECRET || FALLBACK_SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET missing");

  const payload = { ...user, iat: Date.now() };

  const body = b64urlEncodeText(JSON.stringify(payload));
  const sig = await hmacSign(secret, body);
  const token = `${body}.${sig}`;

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

export async function readSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = process.env.SESSION_SECRET || FALLBACK_SESSION_SECRET;
  if (!secret) return null;

  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = await hmacSign(secret, body);
  if (expected !== sig) return null;

  try {
    const json = JSON.parse(b64urlDecodeToText(body));
    return {
      email: String(json.email || ""),
      role: String(json.role || ""),
      restaurant: String(json.restaurant || ""),
      full_name: String(json.full_name || ""),
    };
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
