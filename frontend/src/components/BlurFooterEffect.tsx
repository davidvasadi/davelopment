import { useEffect, useRef } from 'react';

export function BlurFooterEffect() {
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!blurRef.current) return;

      const windowHeight = window.innerHeight;
      const footerEl = document.querySelector('footer div.bg-black');
      if (!footerEl) {
        blurRef.current.style.opacity = '1';
        return;
      }

      const footerTop = footerEl.getBoundingClientRect().top;
      if (footerTop < windowHeight + 100) {
        const fadeOut = Math.max(0, Math.min(1, (footerTop - windowHeight + 150) / 150));
        blurRef.current.style.opacity = fadeOut.toString();
      } else {
        blurRef.current.style.opacity = '1';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // már betöltéskor ellenőrzi az opacity-t
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={blurRef}
      className="fixed bottom-0 left-0 w-full h-10 z-40 pointer-events-none"
      style={{
  background: 'transparent',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.2) 90%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.2) 90%, transparent 100%)',
  opacity: 1,
  transition: 'opacity 0.4s ease-out',
}}

    />
  );
}
