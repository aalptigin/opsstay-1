"use client";

import { useState } from "react";
import { authStore, gsCall } from "../../../../lib/gs";

export default function KayitEkle() {
  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const token = authStore.getToken()!;
      await gsCall("records.add", { full_name, phone, note }, token);
      setName(""); setPhone(""); setNote("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Kayıt Ekle</div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        <input className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none" placeholder="İsim Soyisim"
          value={full_name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none" placeholder="Telefon"
          value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none" placeholder="Not"
          value={note} onChange={(e) => setNote(e.target.value)} />

        <button disabled={loading} onClick={save}
          className="rounded-xl bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-400 disabled:opacity-60">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
