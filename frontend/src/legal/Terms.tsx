import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlurFooterEffect } from '../components/BlurFooterEffect';
import { ContactSection } from '../components/ContactSection';

export function TermsOfServicePage() {
  // Scroll progress for top bar
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  const sections = [
    { id: 'provider', title: 'Szolgáltató adatai' },
    { id: 'terms', title: 'Alapfogalmak' },
    { id: 'services', title: 'Szolgáltatások leírása' },
    { id: 'order', title: 'Megrendelés menete' },
    { id: 'deadline', title: 'Teljesítési határidő' },
    { id: 'payment', title: 'Fizetési feltételek' },
    { id: 'withdrawal', title: 'Elállási jog' },
    { id: 'liability', title: 'Szavatosság és felelősség' },
    { id: 'copyright', title: 'Szerzői jogok' },
    { id: 'privacy', title: 'Adatkezelés' },
    { id: 'dispute', title: 'Jogviták rendezése' },
    { id: 'contact', title: 'Kapcsolat' },
  ];

  // Refs not needed here but can be used for scrollspy

  return (
    <div className="w-full min-h-screen  text-black">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50"
      />
      <Header />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row pt-24 pb-20">
        {/* Sidebar */}
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

        {/* Content */}
        <main className="lg:w-3/4 px-6 space-y-16 prose prose-lg prose-black">
          <section id="provider">
            <h1>Általános Szerződési Feltételek</h1>
            <p><strong>Szolgáltató neve:</strong> Davelopment<br />
            <strong>Székhely:</strong> Budapest, Magyarország<br />
            <strong>Email:</strong> hello@davelopment.hu<br />
            <strong>Telefon:</strong> +36 30 362 8377</p>
          </section>

          <section id="terms">
            <h2>Alapfogalmak</h2>
            <p>A jelen ÁSZF-ben használt fogalmak a mindenkori magyar jogszabályoknak megfelelnek.</p>
          </section>

          <section id="services">
            <h2>Szolgáltatások leírása</h2>
            <p>Cégünk webfejlesztési, UX/UI design, SEO és digitális marketing szolgáltatásokat nyújt egyedi szerződés alapján.</p>
          </section>

          <section id="order">
            <h2>Megrendelés menete</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Kapcsolatfelvétel és igényfelmérés.</li>
              <li>Ajánlat és szerződés előkészítése.</li>
              <li>50% előleg befizetése a projekt indításához.</li>
            </ol>
          </section>

          <section id="deadline">
            <h2>Teljesítési határidő</h2>
            <p>A szerződésben rögzített határidők módosítása csak közös írásbeli megállapodással történhet.</p>
          </section>

          <section id="payment">
            <h2>Fizetési feltételek</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <ul className="list-disc pl-5">
                <li>50% előleg a szerződés aláírását követően.</li>
                <li>Fennmaradó 50% a projekt átadását követően.</li>
                <li>Késedelmes fizetés esetén 8% késedelmi kamat számlánként.</li>
              </ul>
            </div>
          </section>

          <section id="withdrawal">
            <h2>Elállási jog</h2>
            <p>A megrendelő elállhat a szerződéstől, de az addig elvégzett szolgáltatások díját meg kell térítenie.</p>
          </section>

          <section id="liability">
            <h2>Szavatosság és felelősség</h2>
            <p>A Davelopment vállalja a hibák javítását saját felelősségi körben, de nem felelősek közvetett vagy következményes károkért.</p>
          </section>

          <section id="copyright">
            <h2>Szerzői jogok</h2>
            <p>Az elkészült anyagok a teljes kifizetésig a Davelopment tulajdonát képezik, a kifizetés után az ügyfél kizárólagos jogot szerez.</p>
          </section>

          <section id="privacy">
            <h2>Adatkezelés</h2>
            <p>Az adatkezelési szabályzat az <a href="/legal/privacy-policy" className="text-blue-600 hover:underline">Adatvédelmi tájékoztató</a> oldalon található.</p>
          </section>

          <section id="dispute">
            <h2>Jogviták rendezése</h2>
            <p>Vitás kérdéseket elsődlegesen békés úton rendezünk, ennek sikertelensége esetén a magyar bíróságok illetékesek.</p>
          </section>

          <section id="contact">
            <h2>Kapcsolat</h2>
            <p><strong>Email:</strong> hello@davelopment.hu<br />
            <strong>Telefon:</strong> +36 30 362 8377</p>
          </section>
        </main>
      </div>
      <ContactSection />
      <Footer />
      <BlurFooterEffect />
    </div>
  );
}