"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse =
  | { ok: true; user: { email: string; role: string; restaurant: string; full_name: string } }
  | { ok: false; error: string };

export default function PanelIndexPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        const data = (await res.json().catch(() => null)) as MeResponse | null;
        if (!alive) return;
        if (res.ok && data && data.ok) {
          setStatus("ok");
          router.replace("/panel/talepler");
          return;
        }
        setStatus("fail");
        router.replace("/login");
      } catch {
        if (!alive) return;
        setStatus("fail");
        router.replace("/login");
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-white grid place-items-center">
      <div className="text-center">
        <div className="text-lg font-semibold">Panel açılıyor…</div>
        <div className="mt-2 text-sm text-white/60">
          {status === "loading"
            ? "Oturum kontrol ediliyor."
            : status === "ok"
            ? "Yönlendiriliyorsunuz."
            : "Giriş sayfasına yönlendiriliyorsunuz."}
        </div>
      </div>
    </main>
  );
}