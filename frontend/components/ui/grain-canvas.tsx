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

export function GrainCanvas({
  opacity = 1,
  strength = 'medium',
  className,
  zIndex = 0,
}: GrainCanvasProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    const { base, range, alpha } = STRENGTH[strength];
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
      img.data[i + 3] = alpha;
    }
    ctx.putImageData(img, 0, 0);
    setDataUrl(canvas.toDataURL('image/png'));
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
        style={{ zIndex, opacity }}
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
