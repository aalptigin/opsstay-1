"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { authStore, gsCall } from "../../lib/gs";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const r = useRouter();
  const [user, setUser] = useState(authStore.getUser());

  useEffect(() => {
    const token = authStore.getToken();
    if (!token) {
      r.replace("/login");
      return;
    }

    // opsiyonel: WebApp üzerinden token doğrula
    (async () => {
      try {
        const me = await gsCall<{ ok: true; user: any }>("auth.me", {}, token);
        authStore.setUser(me.user);
        setUser(me.user);
      } catch {
        authStore.clear();
        r.replace("/login");
      }
    })();
  }, [r]);

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
