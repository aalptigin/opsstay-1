// app/panel/rezervasyon/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { authStore, gsCall } from "../../lib/gs";

type ReservationRow = {
  id: string;
  date: string;
  time: string;
  full_name: string;
  phone: string;
  note: string;
  created_by?: string;
  created_at?: string;
};

function nowHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ReservationsPage() {
  const token = useMemo(() => authStore.getToken(), []);
  const user = useMemo(() => authStore.getUser(), []);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Sayfa açılınca saat otomatik dolsun (tasarımı etkilemez)
  useEffect(() => {
    if (!time) setTime(nowHHMM());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    if (!token) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await gsCall<{ ok: true; rows: ReservationRow[] }>("reservations.list", {}, token);
      setRows(Array.isArray(res.rows) ? res.rows : []);
    } catch (e: any) {
      setErr(e?.message || "Rezervasyonlar alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAdd = useMemo(() => {
    return date.trim() && time.trim() && fullName.trim().length >= 2 && phone.trim().length >= 7;
  }, [date, time, fullName, phone]);

  async function addReservation() {
    if (!token) return;
    setErr(null);
    setLoading(true);
    try {
      await gsCall<{ ok: true }>(
        "reservations.add",
        {
          date: date.trim(),
          time: time.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          note: note.trim(),
          created_by: user?.email || "",
        },
        token
      );

      // form reset (saat tekrar “şimdi” olsun)
      setFullName("");
      setPhone("");
      setNote("");
      setTime(nowHHMM());

      await load();
    } catch (e: any) {
      setErr(e?.message || "Rezervasyon eklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-3xl font-semibold">Rezervasyon</div>

      {/* ÜST FORM KARTI */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            className="md:col-span-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="GG/AA/YYYY"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={() => {
              // boşsa bugünün tarihi (YYYY-MM-DD) doldur
              if (!date) setDate(todayISO());
            }}
          />

          <input
            className="md:col-span-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="Saat"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            onFocus={() => {
              // ✅ boşsa otomatik "şu anki saat"
              if (!time) setTime(nowHHMM());
            }}
          />

          <input
            className="md:col-span-5 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="İsim Soyisim"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="md:col-span-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />

          <input
            className="md:col-span-12 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="Not"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <button
          disabled={!canAdd || loading}
          onClick={addReservation}
          className="mt-4 w-full md:w-[520px] rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                     py-3 font-semibold text-slate-950 transition-all"
        >
          {loading ? "İşleniyor..." : "Rezervasyon Ekle"}
        </button>
      </div>

      {/* LİSTE BAŞLIK SATIRI */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="grid grid-cols-12 text-sm text-white/80 font-semibold">
          <div className="col-span-2">Tarih</div>
          <div className="col-span-2">Saat</div>
          <div className="col-span-3">İsim</div>
          <div className="col-span-3">Telefon</div>
          <div className="col-span-2 text-right">Not</div>
        </div>
      </div>

      {/* SATIRLAR */}
      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <div className="grid grid-cols-12 text-sm text-white/75">
                <div className="col-span-2">{r.date}</div>
                <div className="col-span-2">{r.time}</div>
                <div className="col-span-3">{r.full_name}</div>
                <div className="col-span-3">{r.phone}</div>
                <div className="col-span-2 text-right truncate">{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rows.length === 0 && !loading && (
        <div className="text-sm text-white/50">Henüz rezervasyon yok.</div>
      )}
    </div>
  );
}
