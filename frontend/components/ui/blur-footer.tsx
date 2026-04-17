'use client';

import { useEffect, useRef } from 'react';

export function BlurFooter() {
    const blurRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!blurRef.current) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const footerEl = document.querySelector('footer');

            const fadeInFromTop = Math.min(1, scrollY / 120);

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
    }, []);

    return (
        <div
            ref={blurRef}
            className="fixed bottom-0 left-0 w-full pointer-events-none z-40"
            style={{
                height: '200px',
                // Semmi háttérszín — csak tiszta blur
                background: 'transparent',
                backdropFilter: 'blur(1px)',
                WebkitBackdropFilter: 'blur(1px)',
                // Maszk: alul látható, felül elhal
                maskImage: 'linear-gradient(to top, black 0%, black 20%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                transition: 'opacity 0.4s ease-out',
            }}
        />
    );
}
