export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="text-white/80 text-sm">iletisim@opsstay.com</div>

          <div className="flex items-center gap-3 pt-4">
            <div className="h-9 w-9 rounded-md bg-white/10 grid place-items-center">
              <span className="text-white font-semibold">✦</span>
            </div>
            <div className="text-lg font-semibold tracking-wide">OPSSTAY</div>
          </div>

          <div className="pt-10 text-xs text-white/50">Tüm hakları saklıdır © 2025</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-3xl font-semibold leading-tight">
            Talebiniz için iletişime geçiniz.
          </div>
          <div className="mt-2 text-white/70 text-sm">
            Entegrasyon soruları veya iş birliği için e-postanızı bırakın. Ekibimiz en kısa sürede iletişime geçer.
          </div>

          <div className="mt-7 flex gap-3">
            <input
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none placeholder:text-white/40"
              placeholder="Kurumsal e-posta"
              type="email"
            />
            <button
              className="rounded-xl bg-white/10 border border-white/15 px-5 py-3 font-semibold hover:bg-white/15"
              type="button"
            >
              Gönder
            </button>
          </div>

          <div className="mt-3 text-xs text-white/50">
            Göndererek gizlilik politikasını kabul etmiş olursunuz.
          </div>
        </div>
      </div>
    </footer>
  );
}
