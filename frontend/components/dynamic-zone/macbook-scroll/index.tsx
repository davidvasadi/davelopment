'use client';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { GrainCanvas } from '@/components/ui/grain-canvas';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { LiveEditDemo } from './LiveEditDemo';

interface MacbookScrollSectionProps {
  title?: string;
  desktop_media?: any;
  mobile_media?: any;
  mobile_animation?: 'zoom' | 'parallax';
  show_gradient?: boolean;
}

function resolveMedia(m: any): string | undefined {
  if (!m) return undefined;
  if (typeof m === 'string') return strapiImage(m);
  if (m?.url) return strapiImage(m.url);
  if (m?.filename) return strapiImage(`/media/${m.filename}`);
  return undefined;
}

function isVideo(m: any): boolean {
  return m?.mimeType?.startsWith('video') ?? m?.mime?.startsWith('video') ?? false;
}

export function MacbookScrollSection({ title, desktop_media, mobile_media, mobile_animation = 'zoom', show_gradient }: MacbookScrollSectionProps) {
  const desktopUrl = resolveMedia(desktop_media);
  const mobileUrl = resolveMedia(mobile_media);
  const src = !isVideo(desktop_media) ? desktopUrl : undefined;
  const videoSrc = isVideo(desktop_media) ? desktopUrl : undefined;
  const mobileSrc = !isVideo(mobile_media) ? mobileUrl : undefined;
  const mobileVideoSrc = isVideo(mobile_media) ? mobileUrl : undefined;

  return (
    <div className="px-0 md:px-2">
      <div className="relative w-full overflow-clip rounded-3xl bg-[#080809]">
        {/* Grain */}
        <GrainCanvas strength="light" opacity={0.45} zIndex={1} />
        {/* Radial glow folt — mint a pricing */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(80,80,120,0.18) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <MacbookScroll
            title={title}
            src={src}
            videoSrc={videoSrc}
            mobileSrc={mobileSrc}
            mobileVideoSrc={mobileVideoSrc}
            mobileAnimation={mobile_animation}
            showGradient={show_gradient ?? false}
            desktopChildren={!desktop_media ? <LiveEditDemo /> : undefined}
            mobileChildren={!mobile_media ? <LiveEditDemo mobile /> : undefined}
          />
        </div>
      </div>
    </div>
  );
}
