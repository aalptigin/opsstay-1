"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  role?: string;
  restaurant?: string;
  fullName?: string;
};

function Item({ href, label }: { href: string; label: string }) {
  const p = usePathname();
  const active = p === href;
  return (
    <Link
      href={href}
      className={[
        "block rounded-xl px-3 py-2 text-sm",
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Sidebar({ role, restaurant, fullName }: Props) {
  return (
    <aside className="w-72 shrink-0 border-r border-white/10 bg-slate-950 text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-base font-semibold">OPSSTAY Panel</div>
        <div className="text-xs text-white/60 mt-1">Yetkili Yönetim</div>
      </div>

      <div className="p-4 space-y-2">
        <Item href="/panel/rezervasyon" label="Rezervasyon" />

        <div className="mt-4">
          <div className="px-2 text-xs uppercase tracking-wider text-white/40 mb-2">Kayıt</div>
          <div className="space-y-1">
            <Item href="/panel/kayit/ekle" label="Kayıt Ekle" />
            <Item href="/panel/kayit/sil" label="Kayıt Sil" />
            <Item href="/panel/kayit/duzenle" label="Kayıt Düzenle" />
            <Item href="/panel/kayit/kontrol" label="Kayıt Kontrol" />
          </div>
        </div>

        <div className="mt-4">
          <Item href="/panel/talepler" label="Talepler" />
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="text-sm text-white/80">{role || "—"} — {restaurant || "—"}</div>
        <div className="text-xs text-white/50 mt-1">{fullName || "—"}</div>
      </div>
    </aside>
  );
}
