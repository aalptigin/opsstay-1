import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "opsstay_session";

function b64UrlToString(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const bin = Buffer.from(b64, "base64").toString("utf-8");
  return bin;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ ok: false, error: "no_session" }, { status: 401 });
    }

    const raw = b64UrlToString(token);
    const user = JSON.parse(raw);

    if (!user?.email) {
      const res = NextResponse.json({ ok: false, error: "bad_token" }, { status: 401 });
      res.cookies.set({ name: COOKIE_NAME, value: "", path: "/", maxAge: 0 });
      return res;
    }

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (e: any) {
    const res = NextResponse.json(
      { ok: false, error: "server_error", detail: String(e?.message || e) },
      { status: 500 }
    );
    return res;
  }
}
