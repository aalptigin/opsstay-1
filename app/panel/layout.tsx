"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { authStore } from "../../lib/gs";

type MeResponse =
  | { ok: true; user: any }
  | { ok: false; error?: string };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const r = useRouter();
  const [user, setUser] = useState<any>(() => authStore.getUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // ✅ httpOnly cookie otomatik gider (credentials include)
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = (await res.json().catch(() => null)) as MeResponse | null;

        if (!res.ok || !data || !("ok" in data) || data.ok !== true) {
          throw new Error((data as any)?.error || "no_session");
        }

        if (cancelled) return;

        authStore.setUser(data.user);
        setUser(data.user);
        setReady(true);
      } catch {
        if (cancelled) return;
        authStore.clear();
        setReady(true);
        r.replace("/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [r]);

  // ✅ doğrulama bitene kadar ekrana bir şey basmayalım (flicker/loop önler)
  if (!ready) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar
        role={user?.role}
        restaurant={user?.restaurant}
        fullName={user?.full_name}
      />
      <div className="flex-1">
        <div className="border-b border-white/10 bg-slate-950/70 px-6 py-4">
          <div className="text-sm text-white/60">OPSSTAY Panel</div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
