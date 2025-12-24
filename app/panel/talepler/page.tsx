"use client";

import { useEffect, useState } from "react";
import { authStore, gsCall } from "../../../lib/gs";

type Req = { id: string; full_name: string; phone: string; message: string; status: string; manager_reply?: string };

export default function Talepler() {
  const [rows, setRows] = useState<Req[]>([]);
  const [reply, setReply] = useState<Record<string, string>>({});

  async function load() {
    const token = authStore.getToken()!;
    const res = await gsCall<{ ok: true; rows: Req[] }>("requests.list", {}, token);
    setRows(res.rows);
  }

  useEffect(() => { load(); }, []);

  async function sendReply(id: string) {
    const token = authStore.getToken()!;
    await gsCall("requests.reply", { id, reply: reply[id] || "" }, token);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Talepler</div>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-semibold">{r.full_name}</div>
              <div className="text-white/60 text-sm">{r.phone}</div>
              <div className="ml-auto text-xs rounded-full bg-white/10 px-3 py-1 text-white/70">{r.status}</div>
            </div>
            <div className="mt-2 text-white/70 text-sm">{r.message}</div>

            <div className="mt-4 flex gap-3">
              <input
                className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"
                placeholder="Müdür yanıtı..."
                value={reply[r.id] ?? r.manager_reply ?? ""}
                onChange={(e) => setReply((p) => ({ ...p, [r.id]: e.target.value }))}
              />
              <button
                onClick={() => sendReply(r.id)}
                className="rounded-xl bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-400"
              >
                Yanıtla
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
