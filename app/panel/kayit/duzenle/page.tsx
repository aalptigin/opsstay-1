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

export default function KayitDuzenlePage() {
  const token = useMemo(() => authStore.getToken(), []);

  const [rows, setRows] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [selected, setSelected] = useState<RecordRow | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("active");

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

  function pick(r: RecordRow) {
    setSelected(r);
    setFullName(r.full_name || "");
    setPhone(r.phone || "");
    setNote(r.note || "");
    setStatus(r.status || "active");
  }

  const canSave =
    !!token &&
    !!selected?.id &&
    fullName.trim().length >= 2 &&
    phone.trim().length >= 7;

  async function onSave() {
    if (!token || !selected?.id) return;
    setErr(null);
    setLoading(true);
    try {
      await gsCall<{ ok: true }>(
        "records.update",
        {
          id: selected.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          note: note.trim(),
          status: status.trim(),
        },
        token
      );
      await load();
      // seçili satırı güncelle
      setSelected(null);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Güncelleme başarısız.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-3xl font-semibold">Kayıt Düzenle</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: LİSTE */}
        <div className="lg:col-span-7 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="grid grid-cols-12 text-sm text-white/80 font-semibold">
              <div className="col-span-3">ID</div>
              <div className="col-span-3">İsim</div>
              <div className="col-span-3">Telefon</div>
              <div className="col-span-3 text-right">Durum</div>
            </div>
          </div>

          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => pick(r)}
              className="w-full text-left rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.05] transition"
            >
              <div className="grid grid-cols-12 text-sm text-white/75">
                <div className="col-span-3 truncate">{r.id}</div>
                <div className="col-span-3 truncate">{r.full_name}</div>
                <div className="col-span-3 truncate">{r.phone}</div>
                <div className="col-span-3 text-right truncate">{r.status}</div>
              </div>
            </button>
          ))}

          {rows.length === 0 && !loading && (
            <div className="text-sm text-white/50">Kayıt yok.</div>
          )}
        </div>

        {/* SAĞ: FORM */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl p-6">
            <div className="text-sm text-white/60">Seçili Kayıt</div>
            <div className="mt-1 font-semibold">
              {selected ? selected.id : "Seçim yok"}
            </div>

            <div className="mt-5 space-y-3">
              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                           focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
                placeholder="İsim Soyisim"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!selected}
              />

              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                           focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
                placeholder="Telefon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                disabled={!selected}
              />

              <input
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                           focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
                placeholder="Not"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!selected}
              />

              <select
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none
                           focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!selected}
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>

              {err && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {err}
                </div>
              )}

              <button
                disabled={!canSave || loading}
                onClick={onSave}
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                           py-3 font-semibold text-slate-950 transition-all"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-white/10 hover:bg-white/5 py-3 font-semibold text-white/80 transition"
              >
                Seçimi Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}