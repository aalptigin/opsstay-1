import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "opsstay_session";

function stringToB64Url(str: string) {
  const b64 = Buffer.from(str, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ Senin .env.local isimlerin:
    // GS_WEBAPP_URL, GS_API_KEY
    // (Yedek olarak NEXT_PUBLIC_* da okuyoruz)
    const GS =
      process.env.GS_WEBAPP_URL || process.env.NEXT_PUBLIC_GS_WEBAPP_URL || "";
    const KEY =
      process.env.GS_API_KEY || process.env.NEXT_PUBLIC_GS_API_KEY || "";

    if (!GS || !KEY) {
      return NextResponse.json({ ok: false, error: "ENV_missing" }, { status: 500 });
    }

    const gsUrl = GS.includes("/exec") ? GS : `${GS.replace(/\/$/, "")}/exec`;
    const url = `${gsUrl}?key=${encodeURIComponent(KEY)}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
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
      return NextResponse.json(
        {
          ok: false,
          error: "GS_bad_response",
          http: r.status,
          hint: "Apps Script deploy 'Anyone' olmalı ve URL /exec olmalı.",
        },
        { status: 401 }
      );
    }

    if (!data.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "invalid_credentials" },
        { status: 401 }
      );
    }

    const payload = { ...data.user, ts: Date.now() };
    const token = stringToB64Url(JSON.stringify(payload));

    const res = NextResponse.json({ ok: true, user: data.user }, { status: 200 });
    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "server_error", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
