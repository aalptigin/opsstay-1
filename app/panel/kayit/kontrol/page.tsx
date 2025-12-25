"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authStore, gsCall } from "../../../../lib/gs";

type CheckResponse =
  | {
      ok: true;
      found: boolean;
      source?: "records" | "blacklist";
      entry?: Record<string, string>;
    }
  | { ok: false; error: string };

export default function KontrolPage() {
  const r = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResponse | null>(null);

  const canSubmit = useMemo(() => {
    return fullName.trim().length > 1 || phone.replace(/\D/g, "").length >= 7;
  }, [fullName, phone]);

  async function onCheck() {
    setErr(null);
    setResult(null);

    const token = authStore.getToken();
    if (!token) {
      r.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const data = await gsCall<CheckResponse>(
        "records.check",
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
        token
      );

      setResult(data);
      if (!data || !data.ok) {
        setErr(data && "error" in data ? data.error : "Kontrol başarısız.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setErr(errorMessage || "Kontrol başarısız.");
    } finally {
      setLoading(false);
    }
  }

  const isFound = result?.ok === true && result.found === true;
  const source = result?.ok === true ? result.source : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-white/60 text-sm">Kayıt / Kontrol</div>
          <h1 className="text-3xl font-semibold mt-1">Kontrol</h1>
          <p className="text-sm text-white/60 mt-2">
            Telefon veya isim ile kayıt/blacklist taraması yapar.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/70">İsim Soyisim (opsiyonel)</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/35
                         transition-all duration-200 hover:border-white/25
                         focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
              placeholder="Örn: Mert Yıldırım"
            />
          </div>

          <div>
            <label className="text-xs text-white/70">Telefon (opsiyonel)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/35
                         transition-all duration-200 hover:border-white/25
                         focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
              placeholder="Örn: 05xx xxx xx xx"
              inputMode="tel"
            />
          </div>
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <button
          onClick={onCheck}
          disabled={!canSubmit || loading}
          className="mt-5 w-full rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                     py-3 font-semibold text-slate-950 transition-all"
        >
          {loading ? "Kontrol ediliyor..." : "Kontrol Et"}
        </button>
      </div>

      {/* SONUÇ */}
      {result && result.ok === true && (
        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-6">
          {!isFound ? (
            <div className="flex items-start gap-3">
              <span className="mt-[6px] h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <div className="font-semibold">Sonuç: Kayıt bulunamadı</div>
                <div className="text-sm text-white/60 mt-1">
                  Records ve Blacklist içinde eşleşme yok.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-amber-300" />
                <div>
                  <div className="font-semibold">
                    Sonuç: Eşleşme bulundu{" "}
                    <span className="text-white/60 font-normal">
                      ({source === "blacklist" ? "Blacklist" : "Records"})
                    </span>
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Aşağıdaki kayıt bilgileri görüntüleniyor.
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-white/10">
                    {Object.entries(result.entry || {}).map(([k, v]) => (
                      <tr key={k} className="bg-slate-950/30">
                        <td className="px-4 py-3 text-white/60 w-[220px]">{k}</td>
                        <td className="px-4 py-3">{v || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-white/50">
                Not: Bu ekran yalnızca kayıt taraması yapar. Nihai karar işletme yönetimindedir.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}