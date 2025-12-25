"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length > 2;
  }, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ HER ZAMAN bizim API route'a git (cookie burada set ediliyor)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text().catch(() => "");
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Giriş başarısız. Bilgileri kontrol edin.");
      }

      // ✅ Router yerine tam sayfa geçiş: cookie %100 oturur
      window.location.assign("/panel");
    } catch (err: any) {
      setError(err?.message || "Giriş başarısız. Bilgileri kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  const bg = "/meeting.jpg";

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-center bg-cover scale-[1.08] blur-[7px] brightness-[0.55] contrast-[1.05]"
          style={{ backgroundImage: `url('${bg}')` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_30%_20%,rgba(56,189,248,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_70%_70%,rgba(14,165,233,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950/90" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-500/15 grid place-items-center border border-sky-500/25">
                  <span className="text-sky-300 font-semibold">o</span>
                </div>
                <div>
                  <div className="font-semibold">opsstay</div>
                  <div className="text-xs text-white/60">
                    Misafir Ön Kontrol &amp; Güvenli Konaklama
                  </div>
                </div>
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-tight">
                Panele giriş yapın
              </h1>

              <p className="mt-4 text-sm text-white/70 max-w-md leading-6">
                Bu alan sadece yetkilendirilmiş kullanıcılar içindir. Misafir ön kontrol
                sonuçları, operasyon notları ve yönetim raporlarına buradan erişirsiniz.
              </p>
            </div>

            <div className="p-10 border-t md:border-t-0 md:border-l border-white/10">
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/70">Kurumsal e-posta</label>
                  <motion.input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    whileFocus={{ scale: 1.01 }}
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/35
                               transition-all duration-200 hover:border-white/25
                               focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
                    placeholder="ornek@isletmeniz.com"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/70">Şifre</label>
                  <div className="mt-2 relative">
                    <motion.input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 pr-20 outline-none placeholder:text-white/35
                                 transition-all duration-200 hover:border-white/25
                                 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"
                      placeholder="••••••••"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs text-white/70
                                 hover:bg-white/10 transition-colors"
                    >
                      {show ? "Gizle" : "Göster"}
                    </motion.button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  disabled={!canSubmit || loading}
                  whileHover={
                    !(!canSubmit || loading)
                      ? { y: -2, boxShadow: "0 18px 50px rgba(56,189,248,0.18)" }
                      : {}
                  }
                  whileTap={!(!canSubmit || loading) ? { scale: 0.99 } : {}}
                  className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                             py-3 font-semibold text-slate-950 transition-all"
                  type="submit"
                >
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </motion.button>

                <div className="pt-2 text-xs text-white/55 leading-5">
                  Bu panele giriş yaparak, yalnızca görev tanımınız kapsamında sisteme erişmeyi
                  kabul etmiş olursunuz.
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 p-10">
            <div className="text-[11px] tracking-[0.35em] text-white/55 font-semibold">
              OPERASYON EKİBİ İÇİN TASARLANDI
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="text-2xl font-semibold leading-snug">
                  Tek ekranda operasyonel ön kontrol süreci.
                </div>
                <p className="mt-3 text-sm text-white/70 leading-6">
                  Opsstay; farklı kaynaklardan gelen notları tek bir çerçevede birleştirir.
                  Karar otel/işletme yönetimindedir, sistem sadece destekleyici özet üretir.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-white/75">
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Anlık ön kontrol sonuçları ve özet görünür.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] h-2 w-2 rounded-full bg-sky-400" />
                  <span>KVKK prensiplerine uygun, sadeleştirilmiş bilgi akışı.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] h-2 w-2 rounded-full bg-amber-300" />
                  <span>Departmanlar arası tutarlı dil ve kayıt yönetimi.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 text-center text-xs text-white/40">
              © 2025 Opsstay. Tüm hakları saklıdır.
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
