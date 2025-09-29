import { useEffect } from 'react';

export function useClearHashOnExit(anchorId: string) {
  useEffect(() => {
    const el = document.getElementById(anchorId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Ha kilép a viewportból ÉS a hash még megegyezik az anchorId-vel…
        if (!entry.isIntersecting && window.location.hash === `#${anchorId}`) {
          // … akkor cseréljük az URL-t hash nélkülre
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      },
      { threshold: 0.1 } // akkor is, ha csak 10% látszik még
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [anchorId]);
}
