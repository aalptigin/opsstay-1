"use client";

import { useEffect, useMemo, useState } from "react";
import { authStore, gsCall } from "../../../../lib/gs";

type RecordRow = {
  id: string;
  full_name: string;
  phone: string;
  note: string;
  status: string;
  updated_at?: string;
};

export default function KayitSilPage() {
  const token = useMemo(() => authStore.getToken(), []);
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await gsCall<{ ok: true; rows: RecordRow[] }>(
        "records.list",
        {},
        token
      );
      setRows(Array.isArray(res.rows) ? res.rows : []);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Kayıtlar alınamadı.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function del(id: string) {
    if (!token) return;
    setErr(null);
    setLoading(true);
    try {
      await gsCall<{ ok: true }>("records.delete", { id }, token);
      await load();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Silme başarısız.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-3xl font-semibold">Kayıt Sil</div>
      {err && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      )}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="grid grid-cols-12 text-sm text-white/80 font-semibold">
          <div className="col-span-2">ID</div>
          <div className="col-span-3">İsim</div>
          <div className="col-span-3">Telefon</div>
          <div className="col-span-2">Durum</div>
          <div className="col-span-2 text-right">İşlem</div>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
          >
            <div className="grid grid-cols-12 text-sm text-white/75 items-center">
              <div className="col-span-2 truncate">{r.id}</div>
              <div className="col-span-3 truncate">{r.full_name}</div>
              <div className="col-span-3 truncate">{r.phone}</div>
              <div className="col-span-2 truncate">{r.status}</div>
              <div className="col-span-2 flex justify-end">
                <button
                  disabled={loading}
                  onClick={() => del(r.id)}
                  className="rounded-xl bg-red-500/90 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed
                             px-4 py-2 text-sm font-semibold text-white transition"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && !loading && (
          <div className="text-sm text-white/50">Kayıt yok.</div>
        )}
      </div>
    </div>
  );
}