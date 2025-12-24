"use client";

import { useEffect, useState } from "react";
import { authStore, gsCall } from "../../../lib/gs";

type Row = {
  id: string;
  date: string;
  time: string;
  full_name: string;
  phone: string;
  note: string;
};

export default function RezervasyonPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ date: "", time: "", full_name: "", phone: "", note: "" });
  const [loading, setLoading] = useState(false);

  async function load() {
    const token = authStore.getToken()!;
    const res = await gsCall<{ ok: true; rows: Row[] }>("reservations.list", {}, token);
    setRows(res.rows);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    setLoading(true);
    try {
      const token = authStore.getToken()!;
      await gsCall("reservations.add", form, token);
      setForm({ date: "", time: "", full_name: "", phone: "", note: "" });
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Rezervasyon</div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 grid gap-3 md:grid-cols-6">
        <input className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none" placeholder="GG/AA/YYYY"
          value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none" placeholder="Saat"
          value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <input className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none md:col-span-2" placeholder="İsim Soyisim"
          value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none" placeholder="Telefon"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none md:col-span-6" placeholder="Not"
          value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />

        <button disabled={loading}
          onClick={add}
          className="md:col-span-2 rounded-xl bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-400 disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : "Rezervasyon Ekle"}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="text-left p-3">Tarih</th>
              <th className="text-left p-3">Saat</th>
              <th className="text-left p-3">İsim</th>
              <th className="text-left p-3">Telefon</th>
              <th className="text-left p-3">Not</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.time}</td>
                <td className="p-3">{r.full_name}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3 text-white/70">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
