export async function onRequestPost({ request, env }: any) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return json({ ok: false, error: "missing_fields" }, 400);
    }

    const GS = env.NEXT_PUBLIC_GS_WEBAPP_URL;
    const KEY = env.NEXT_PUBLIC_GS_API_KEY;
    const SESSION_SECRET = env.SESSION_SECRET;

    if (!GS || !KEY) return json({ ok: false, error: "missing_env_gs" }, 500);
    if (!SESSION_SECRET) return json({ ok: false, error: "missing_env_session_secret" }, 500);

    const url = `${GS}?key=${encodeURIComponent(KEY)}`;

    const gsRes = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });

    const data = await gsRes.json().catch(() => null);

    if (!gsRes.ok || !data) {
      return json({ ok: false, error: `gs_http_${gsRes.status}` }, 502);
    }

    if (!data.ok) {
      return json({ ok: false, error: String(data.error || "invalid_credentials") }, 401);
    }

    // ✅ session cookie
    const token = await signSession({ user: data.user, ts: Date.now() }, SESSION_SECRET);

    const secure = new URL(request.url).protocol === "https:";
    const cookie =
      `opsstay_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800` +
      (secure ? `; Secure` : "");

    return new Response(JSON.stringify({ ok: true, user: data.user }), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "set-cookie": cookie,
      },
    });
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

async function signSession(payload: any, secret: string) {
  const payloadB64 = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacSha256(payloadB64, secret);
  return `${payloadB64}.${sig}`;
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

function b64urlEncode(bytes: Uint8Array) {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  const b64 = btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
