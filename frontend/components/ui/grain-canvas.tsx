'use client';

import { useEffect, useRef, useState } from 'react';

// ============================================================
// GRAIN CANVAS — animált, optimalizált
//
// Hogyan működik:
// 1. Offscreen canvas-on generál egy 256x256 noise tile-t (egyszer)
// 2. toDataURL()-lel CSS background-image-be tölti
// 3. A div CSS background-repeat: repeat + animation: translate
//    → GPU-n fut, nulla JS overhead animáció közben
//    → nem látszik a téglalaphatár mert a tile ismétlődik
// ============================================================

type GrainStrength = 'light' | 'medium' | 'heavy';

const STRENGTH: Record<GrainStrength, { base: number; range: number; alpha: number }> = {
  light:  { base: 20, range: 30, alpha: 180 },
  medium: { base: 8,  range: 55, alpha: 255 },
  heavy:  { base: 0,  range: 80, alpha: 255 },
};

type GrainCanvasProps = {
  opacity?: number;
  strength?: GrainStrength;
  className?: string;
  zIndex?: number;
};

// A zajtextúra tiszta véletlen pixeladat, amit a PNG (veszteségmentes) nagyon
// rosszul tömörít (~80-90 KB/csempe) — JPEG-gel sokkal kisebb, mert a szem
// nem veszi észre a veszteséget egy finom grain-effektnél. Az alpha-csatornát
// (ami a JPEG-ben nincs) a hívó oldali CSS opacity-be sűrítjük bele.
// Egy adott erősséghez (light/medium/heavy) egyszer generáljuk le a csempét,
// és minden <GrainCanvas> instance (akár 4-5 is egy oldalon) ugyanazt a
// data URL-t használja — nincs ok rá, hogy mindegyik saját, külön zajt
// generáljon és saját base64 payloadot hordozzon.
const tileCache = new Map<GrainStrength, string>();

function generateTile(strength: GrainStrength): string {
  const cached = tileCache.get(strength);
  if (cached) return cached;

  const { base, range } = STRENGTH[strength];
  const SIZE = 256;

  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = base + Math.random() * range;
    img.data[i]     = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
  tileCache.set(strength, dataUrl);
  return dataUrl;
}

export function GrainCanvas({
  opacity = 1,
  strength = 'medium',
  className,
  zIndex = 0,
}: GrainCanvasProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const { alpha } = STRENGTH[strength];
  // a korábbi, pixelenkénti alpha-csatornát itt, a CSS opacity-ben pótoljuk
  const effectiveOpacity = opacity * (alpha / 255);

  useEffect(() => {
    setDataUrl(generateTile(strength));
  }, [strength]);

  if (!dataUrl) return null;

  return (
    <>
      <style>{`
        @keyframes grain-move {
          0%   { transform: translate(0,   0);   }
          10%  { transform: translate(-2%, -3%); }
          20%  { transform: translate(-4%,  2%); }
          30%  { transform: translate( 2%, -4%); }
          40%  { transform: translate(-2%,  4%); }
          50%  { transform: translate(-4%,  3%); }
          60%  { transform: translate( 4%,  0%); }
          70%  { transform: translate( 0%,  4%); }
          80%  { transform: translate( 1%,  3%); }
          90%  { transform: translate(-3%,  3%); }
          100% { transform: translate(0,   0);   }
        }
      `}</style>
      <div
        aria-hidden
        className={className ?? 'absolute inset-0 pointer-events-none overflow-hidden'}
        style={{ zIndex, opacity: effectiveOpacity }}
      >
        <div
          style={{
            position: 'absolute',
            // extra méret hogy a translate ne mutasson fehér széleket
            inset: '-50%',
            width: '200%',
            height: '200%',
            backgroundImage: `url(${dataUrl})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            animation: 'grain-move 0.8s steps(1) infinite',
            willChange: 'transform',
          }}
        />
      </div>
    </>
  );
}
