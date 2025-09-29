import { useScroll, useTransform, motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlurFooterEffect } from '../components/BlurFooterEffect';
import { ContactSection } from '../components/ContactSection';

export function PrivacyPolicyPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const sections = [
    { id: 'controller', title: 'Adatkezelő' },
    { id: 'data-collected', title: 'Gyűjtött adatok' },
    { id: 'purpose', title: 'Az adatkezelés célja' },
    { id: 'legal-basis', title: 'Adatkezelés jogalapja' },
    { id: 'retention', title: 'Adatmegőrzési idő' },
    { id: 'third-parties', title: 'Harmadik felek' },
    { id: 'cookies', title: 'Sütik' },
    { id: 'rights', title: 'Érintetti jogok' },
    { id: 'changes', title: 'Változások' },
    { id: 'contact', title: 'Kapcsolat' },
  ];

  return (
    <div className="w-full min-h-screen  text-black">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50"
      />
      <Header />
      <div className="max-w-7xl mx-auto lg:flex pt-24 pb-20">
        {/* Sidebar navigation */}
        <nav className="hidden lg:block w-1/4 px-6 sticky top-28 self-start">
          <ul className="space-y-2">
            {sections.map(sec => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="text-sm text-gray-600 hover:text-black transition"
                >
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content sections */}
        <main className="lg:w-3/4 px-6 space-y-16 prose prose-lg prose-black">
          <section id="controller">
            <h1>Adatvédelmi Tájékoztató</h1>
            <p>
              Davelopment (továbbiakban: Adatkezelő) elérhetősége:
              <br />Székhely: Budapest, Magyarország
              <br />Email: hello@davelopment.hu
            </p>
          </section>

          <section id="data-collected">
            <h2>Gyűjtött adatok</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Név, email cím a kapcsolatfelvételi űrlapon</li>
              <li>IP-cím, sütik, böngészési adatok</li>
              <li>Google Analytics és hasonló elemző eszközök adatai</li>
            </ul>
          </section>

          <section id="purpose">
            <h2>Az adatkezelés célja</h2>
            <p>
              A kapcsolatfelvétel biztosítása, szolgáltatások nyújtása,
              valamint weboldal működésének és teljesítményének elemzése.
            </p>
          </section>

          <section id="legal-basis">
            <h2>Adatkezelés jogalapja</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Érintett hozzájárulása (GDPR 6. cikk a) pont)</li>
              <li>Adatkezelő jogos érdeke (weboldal elemzés)</li>
            </ul>
          </section>

          <section id="retention">
            <h2>Adatmegőrzési idő</h2>
            <p>
              A kapcsolatfelvételi üzeneteket 3 évig, elemzési adatokat 14 hónapig őrizzük.
            </p>
          </section>

          <section id="third-parties">
            <h2>Harmadik felek</h2>
            <p>
              Google Analytics, Mailchimp és más szolgáltatók használata esetén azok adatkezeléseiről az adott szolgáltató tájékoztat.
            </p>
          </section>

          <section id="cookies">
            <h2>Sütik</h2>
            <p>
              Sütiket használunk a weboldal működéséhez és analitikához. A sütik elfogadását a böngésző beállításain keresztül lehet kezelni.
            </p>
          </section>

          <section id="rights">
            <h2>Érintetti jogok</h2>
            <p>
              Hozzáférés, helyesbítés, törlés, adatkezelés korlátozása és tiltakozás joga. Kérelem esetén az info@davelopment.hu címre írhat.
            </p>
          </section>

          <section id="changes">
            <h2>Változások</h2>
            <p>
              A tájékoztató frissítése esetén a módosítás dátuma megjelenik ezen az oldalon.
            </p>
          </section>

          <section id="contact">
            <h2>Kapcsolat</h2>
            <p>
              Kérdések esetén kérjük, írj nekünk:
              <br /><strong>Email:</strong> hello@davelopment.hu
            </p>
          </section>
        </main>
      </div>

      <ContactSection />
      <Footer />
      <BlurFooterEffect />
    </div>
  );
}
