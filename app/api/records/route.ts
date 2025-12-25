import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getEnv() {
  const GS = process.env.GS_WEBAPP_URL || process.env.NEXT_PUBLIC_GS_WEBAPP_URL || "";
  const KEY = process.env.GS_API_KEY || process.env.NEXT_PUBLIC_GS_API_KEY || "";
  return { GS, KEY };
}

async function callGS(action: string, body: any) {
  const { GS, KEY } = getEnv();
  if (!GS || !KEY) throw new Error("ENV_missing");

  const gsUrl = GS.includes("/exec") ? GS : `${GS.replace(/\/$/, "")}/exec`;
  const url = `${gsUrl}?key=${encodeURIComponent(KEY)}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, ...body }),
    cache: "no-store",
  });

  const text = await r.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!r.ok || !data) throw new Error("GS_bad_response");
  return data;
}

// GET: list
export async function GET() {
  try {
    const data = await callGS("records.list", {});
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "server_error", detail: String(e?.message || e) }, { status: 500 });
  }
}

// POST: add/update/delete/check => {op:"add"|"update"|"delete"|"check", ...}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const op = String(body.op || "");
    if (op === "add") return NextResponse.json(await callGS("records.add", body), { status: 200 });
    if (op === "update") return NextResponse.json(await callGS("records.update", body), { status: 200 });
    if (op === "delete") return NextResponse.json(await callGS("records.delete", body), { status: 200 });
    if (op === "check") return NextResponse.json(await callGS("records.check", body), { status: 200 });
    return NextResponse.json({ ok: false, error: "unknown_op" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "server_error", detail: String(e?.message || e) }, { status: 500 });
  }
}
