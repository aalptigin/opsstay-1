"use client";

import { useMemo, useState } from "react";
import { authStore, gsCall } from "../../../../lib/gs";

export default function KayitEklePage() {
  const token = useMemo(() => authStore.getToken(), []);
  const user = useMemo(() => authStore.getUser(), []);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit =
    fullName.trim().length >= 2 && phone.trim().length >= 7 && !!token;

  async function onAdd() {
    if (!token) return;
    setErr(null);
    setOkMsg(null);
    setLoading(true);
    try {
      await gsCall<{ ok: true }>(
        "records.add",
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          note: note.trim(),
          status,
          created_by: user?.email || "",
        },
        token
      );

      setOkMsg("Kayıt eklendi.");
      setFullName("");
      setPhone("");
      setNote("");
      setStatus("active");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Kayıt eklenemedi.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-3xl font-semibold">Kayıt Ekle</div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            className="md:col-span-6 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="İsim Soyisim"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="md:col-span-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none placeholder:text-white/35
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />

          <select
            className="md:col-span-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none
                       focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
            value={status}
            onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>

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
        {okMsg && (
          <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {okMsg}
          </div>
        )}

        <button
          disabled={!canSubmit || loading}
          onClick={onAdd}
          className="mt-4 w-full md:w-[520px] rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                     py-3 font-semibold text-slate-950 transition-all"
        >
          {loading ? "Ekleniyor..." : "Kayıt Ekle"}
        </button>
      </div>
    </div>
  );
}