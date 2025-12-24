"use client";

import { useState } from "react";

export default function DuzenlePage() {
  const [recordId, setRecordId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // Not: API tarafını daha sonra tam bağlayacağız.
      // Şimdilik build kırılmasın diye güvenli placeholder.
      const res = await fetch("/api/records", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "update",
          recordId,
          fullName,
          phone,
          note,
        }),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız.");
      setStatus("ok");
      setMessage("Kayıt güncellendi.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Bir hata oluştu.");
    }
  }

  return (
    <div className="min-h-[calc(100vh-40px)] p-6">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Kayıt Düzenle</h1>
          <p className="mt-1 text-sm text-white/60">
            Kayıt ID veya telefon ile kaydı bulup bilgileri güncelleyin.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/70">Kayıt ID</label>
              <input
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                placeholder="Örn: 1024"
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/30
                           hover:border-white/25 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15 transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/70">İsim Soyisim</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn: Alp Eren"
                  className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/30
                             hover:border-white/25 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15 transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-white/70">Telefon</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Örn: +90 5xx xxx xx xx"
                  className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/30
                             hover:border-white/25 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/70">Not</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder="Kısa açıklama..."
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/30
                           hover:border-white/25 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15 transition-all resize-none"
              />
            </div>

            {message && (
              <div
                className={[
                  "rounded-xl px-4 py-3 text-sm border",
                  status === "ok"
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                    : status === "error"
                    ? "bg-red-500/10 border-red-500/25 text-red-200"
                    : "bg-white/5 border-white/10 text-white/70",
                ].join(" ")}
              >
                {message}
              </div>
            )}

            <button
              disabled={status === "loading"}
              className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                         py-3 font-semibold text-slate-950 transition-all"
              type="submit"
            >
              {status === "loading" ? "Güncelleniyor..." : "Kaydı Güncelle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
