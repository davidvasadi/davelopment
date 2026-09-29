'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function BlurFooter() {
    const blurRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (!blurRef.current) return;

            const windowHeight = window.innerHeight;
            const footerEl = document.querySelector('footer');
            const heroEl = document.querySelector('[data-hero-section]');

            // Ha van hero az oldalon: csak annak elhagyása után jelenjen meg.
            // Ha nincs hero: mindig ott van (nincs scroll-alapú bejövő fade).
            let fadeInFromTop = 1;
            if (heroEl) {
                const heroBottom = heroEl.getBoundingClientRect().bottom;
                // Kicsit a hero teljes eltűnése előtt már bekapcsol (nem vár, amíg 100%-ban eltűnik).
                fadeInFromTop = heroBottom <= 500 ? 1 : 0;
            }

            let fadeOutNearFooter = 1;
            if (footerEl) {
                const footerTop = footerEl.getBoundingClientRect().top;
                if (footerTop < windowHeight + 80) {
                    fadeOutNearFooter = Math.max(0, Math.min(1, (footerTop - windowHeight + 120) / 120));
                }
            }

            blurRef.current.style.opacity = Math.min(fadeInFromTop, fadeOutNearFooter).toString();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    return (
        <div
            ref={blurRef}
            className="fixed bottom-0 left-0 w-full pointer-events-none z-40"
            style={{
                height: '200px',
                // Semmi háttérszín — csak tiszta blur
                background: 'transparent',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                // Maszk: alul látható, felül elhal
                maskImage: 'linear-gradient(to top, black 0%, black 20%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                transition: 'opacity 0.4s ease-out',
            }}
        />
    );
}
