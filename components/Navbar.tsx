"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-slate-950/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-sky-500 grid place-items-center text-slate-950 font-bold">
              O
            </div>
            <div className="leading-tight">
              <div className="text-white font-semibold">opsstay</div>
              <div className="text-[11px] text-white/60">
                Misafir Ön Kontrol &amp; Güvenli Konaklama
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#cozumler" className="hover:text-white">Çözümler</a>
            <a href="#hakkimizda" className="hover:text-white">Hakkımızda</a>
            <a href="#neler" className="hover:text-white">Neler yapabiliriz</a>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </header>
  );
}
