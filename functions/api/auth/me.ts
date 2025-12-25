export async function onRequestGet({ request, env }: any) {
  try {
    const token = getCookie(request.headers.get("cookie") || "", "opsstay_session");
    if (!token) return json({ ok: false, error: "no_session" }, 401);

    const SESSION_SECRET = env.SESSION_SECRET;
    if (!SESSION_SECRET) return json({ ok: false, error: "missing_env_session_secret" }, 500);

    const payload = await verifySession(token, SESSION_SECRET);
    if (!payload) return json({ ok: false, error: "invalid_session" }, 401);

    return json({ ok: true, user: payload.user });
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
}

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function getCookie(cookieHeader: string, name: string) {
  const m = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? m[1] : "";
}

async function verifySession(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;

  const expected = await hmacSha256(payloadB64, secret);
  if (!timingSafeEqual(sig, expected)) return null;

  const jsonStr = new TextDecoder().decode(b64urlDecode(payloadB64));
  return JSON.parse(jsonStr);
}

async function hmacSha256(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64urlEncode(new Uint8Array(sigBuf));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function b64urlEncode(bytes: Uint8Array) {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  const b64 = btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecode(s: string) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const str = atob(b64);
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i);
  return out;
}
