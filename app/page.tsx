import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MotionReveal from "../components/MotionReveal";

export default function Home() {
  return (
    <main className="bg-slate-950 text-white">
      <Navbar />

      {/* HERO (saydam bant yok + yüzler daha iyi kadraj + akış animasyonu) */}
      <section className="pt-16">
        <div className="relative h-[520px] w-full overflow-hidden">
          <Image
            src="/hero.jpg"
            alt="Hero"
            fill
            priority
            className="object-cover object-[50%_20%]"
          />

          {/* daha net görsel için daha hafif overlay */}
          <div className="absolute inset-0 bg-slate-950/40" />

          <div className="absolute inset-0">
            <div className="mx-auto max-w-6xl px-6 h-full flex items-center">
              <MotionReveal delay={0.05} y={22}>
                <div className="max-w-2xl">
                  <div className="text-xs tracking-[0.25em] text-white/70">
                    KVKK UYUMLU ÖN KONTROL
                  </div>
                  <h1 className="mt-5 text-5xl leading-[1.05] font-semibold">
                    Kişisel veri yok, <br />
                    tam kontrol sizde. <br />
                    Otel karar verir, sistem <br />
                    bilgilendirir.
                  </h1>
                  <p className="mt-5 text-white/70 text-sm max-w-xl">
                    Opsstay, misafir geçmişini anonim ve kurumsal bir dile çevirerek,
                    yalnızca operasyon için gerekli özet bilgiyi sunar. Risk uyarısı gelir,
                    son kararı her zaman otel yönetimi verir.
                  </p>

                  <div className="mt-7 flex gap-3">
                    <a
                      className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                      href="#cozumler"
                    >
                      Opsstay’i keşfedin
                    </a>
                    <a
                      className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15"
                      href="#hakkimizda"
                    >
                      Çözüm detaylarını inceleyin
                    </a>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3’lü görsel + başlık (akış animasyonu) */}
      <section id="cozumler" className="bg-slate-100 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex justify-center gap-10 items-end">
            <MotionReveal delay={0.06}>
              <div className="relative w-[290px] h-[170px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/lobby.jpg" alt="Lobby" fill className="object-cover" />
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12} y={26}>
              <div className="relative w-[420px] h-[240px] rounded-2xl overflow-hidden shadow-2xl -translate-y-4">
                <Image src="/meeting.jpg" alt="Meeting" fill className="object-cover" />
              </div>
            </MotionReveal>

            <MotionReveal delay={0.18}>
              <div className="relative w-[290px] h-[170px] rounded-2xl overflow-hidden shadow-xl">
                <Image src="/wall.jpg" alt="Wall" fill className="object-cover" />
              </div>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.05}>
            <div className="text-center mt-10">
              <div className="text-[11px] tracking-[0.35em] text-sky-600 font-semibold">
                TEK BAKIŞTA ÖN KONTROL ÇERÇEVESİ
              </div>
              <h2 className="mt-3 text-4xl font-semibold">
                Her misafir için aynı standart,{" "}
                <span className="text-sky-600">her karar için</span>
                <br />
                <span className="text-sky-600">aynı güven.</span>
              </h2>
              <p className="mt-4 text-slate-700 text-sm max-w-3xl mx-auto">
                Opsstay, kişisel veri paylaşmadan, misafir yolculuğuna dair kritik bilgileri tek ekranda toplar.
                Operasyon ekibi farklı sistemlere dağılmış notların peşinden koşmaz; net bir çerçeve üzerinden,
                tutarlı ve güvenli karar alır.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Hakkımızda + sağ kutular */}
      <section id="hakkimizda" className="bg-slate-50 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-2">
          <MotionReveal delay={0.04}>
            <div>
              <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-600 px-3 py-1 text-xs font-semibold">
                Opsstay hakkında
              </span>
              <h3 className="mt-4 text-3xl font-semibold">
                Opsstay, misafir yolculuğuna{" "}
                <span className="text-sky-600">ön kontrol katmanı</span> ekler.
              </h3>
              <p className="mt-4 text-slate-700 text-sm leading-7">
                Günümüz konaklama işletmelerinde misafir bilgisi; farklı sistemlere dağılmış, tutarsız ve çoğu zaman
                operasyon ekibinin elinde yeterince hazırlanmamış halde. Opsstay, bu dağınık yapıyı tek bir kurumsal görüşe çevirir.
                <br />
                <br />
                Amacımız; resepsiyon, güvenlik, F&amp;B ve yönetim ekiplerine misafir daha otele gelmeden önce
                “Bu misafir bizim için ne ifade ediyor?” sorusunun cevabını, sade ve anlaşılır bir dille sunmak.
              </p>
            </div>
          </MotionReveal>

          <div className="space-y-4">
            <MotionReveal delay={0.06}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="font-semibold text-sm">Neleri önemsiyoruz?</div>
                <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
                  <li>KVKK uyumu ve kişisel verinin gizliliği</li>
                  <li>Departmanlar arası ortak ve sade bir dil</li>
                  <li>Operasyon ekibine gerçek anlamda zaman kazandırmak</li>
                </ul>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="font-semibold text-sm">Nasıl sonuçlar hedefliyoruz?</div>
                <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
                  <li>Misafir ön kontrolünde %80’e varan zaman tasarrufu</li>
                  <li>Daha öngörülebilir check-in süreçleri</li>
                  <li>“Check edildi, sorun beklenmez” diyebildiğiniz bir misafir portföyü</li>
                </ul>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Saha akışı (kartlar scroll’da akış halinde) */}
      <section id="neler" className="bg-slate-50 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <MotionReveal delay={0.04}>
            <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-600 px-3 py-1 text-xs font-semibold">
              Opsstay sahada nasıl görünür?
            </span>
            <h3 className="mt-4 text-3xl font-semibold">
              Ekranda sadece bir panel değil,{" "}
              <span className="text-sky-600">tüm ekibinize net bir çerçeve</span> sunar.
            </h3>
            <p className="mt-3 text-slate-700 text-sm max-w-3xl">
              Aşağı kaydırdıkça; resepsiyon, güvenlik, F&amp;B ve yönetim ekiplerinin Opsstay ile nasıl çalıştığını göreceksiniz.
              Her senaryo, scroll ettikçe yavaşça yukarı çıkan kartlarla anlatılır.
            </p>
          </MotionReveal>

          <div className="mt-10 space-y-10">
            <MotionReveal delay={0.04} y={22}>
              <Row
                title="Resepsiyon / Ön Büro"
                subtitle="Kişisel veri yok, tam kontrol sizde."
                bullets={[
                  "Rezervasyon açıldığı anda misafir ön kontrol süreci otomatik tetiklenir.",
                  "Ekip, karmaşık veriler yerine sade bir değerlendirme görür.",
                  "Misafir masaya geldiğinde operasyon hazır ve sakin olur.",
                ]}
                quote="“Misafir gelmeden önce net bir özet görmek, resepsiyon ekibinin tonunu tamamen değiştiriyor.”"
                img="/reception.jpg"
                tag="Ön büro ekibi"
              />
            </MotionReveal>

            <MotionReveal delay={0.06} y={22}>
              <Row
                title="Güvenlik / Gece Operasyonu"
                subtitle="Gece vardiyasında sürpriz değil, öngörü var."
                bullets={[
                  "Olası riskli durumlar, kişisel veri paylaşmadan işaretlenir.",
                  "Güvenlik ve resepsiyon aynı dili, aynı ekrandan konuşur.",
                ]}
                quote="“Gece ekipleri için en değerli şey; belirsizlik yerine öngörü.”"
                img="/security.jpg"
                tag="Güvenlik ekibi"
              />
            </MotionReveal>

            <MotionReveal delay={0.08} y={22}>
              <Row
                title="F&B / Servis Ekibi"
                subtitle="Masaya oturmadan önce misafir beklentisini bilirsiniz."
                bullets={[
                  "Alerji, tercih edilen saatler, alışkanlıklar önceden görünür.",
                  "Servis ekibi misafire “ilk kez görüyormuş” gibi değil, tanıyor gibi yaklaşır.",
                  "Bu da restoranın genel marka algısını yukarı taşır.",
                ]}
                quote="“Misafir daha sipariş vermeden neyi sevdiğini bilmek servisin kalitesini ciddi etkiliyor.”"
                img="/fnb.jpg"
                tag="Restoran & bar"
              />
            </MotionReveal>

            <MotionReveal delay={0.1} y={22}>
              <Row
                title="Yönetim / Revenue"
                subtitle="Oda numarasından değil, ilişki değerinden bakarsınız."
                bullets={[
                  "Operasyonel riskler ile değerli misafir segmentlerini ayrıştırır.",
                  "Farklı departmanların notları ortak ve standart bir dile oturtulur.",
                  "Yönetim, misafir portföyüne büyük resimden bakabilir.",
                ]}
                quote="“Opsstay, misafirlerimizi sadece ‘oda’ değil, ‘ilişki’ olarak görmemizi sağladı.”"
                img="/revenue.jpg"
                tag="Genel müdür & gelir"
              />
            </MotionReveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Row({
  img,
  tag,
  title,
  subtitle,
  bullets,
  quote,
}: {
  img: string;
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
  quote: string;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-2 items-center">
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <div className="absolute top-3 left-3 z-10 rounded-full bg-black/40 text-white text-xs px-3 py-1">
          {tag}
        </div>
        <Image
          src={img}
          alt={title}
          width={980}
          height={600}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs text-white/80">
          Bu görselleri restoranınızdan gerçek karelerle güncelleyerek, Opsstay’in sahadaki kullanımını misafir yolculuğu üzerinden gösterebilirsiniz.
        </div>
      </div>

      <div>
        <div className="text-2xl font-semibold">{subtitle}</div>
        <div className="mt-3 text-slate-700 text-sm">{title}</div>

        <ul className="mt-4 space-y-2 text-sm text-slate-800">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-sky-600 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-l-2 border-sky-200 pl-4 text-sm text-sky-700 italic">
          {quote}
        </div>
      </div>
    </div>
  );
}
