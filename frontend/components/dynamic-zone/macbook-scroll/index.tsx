'use client';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { strapiImage } from '@/lib/strapi/strapiImage';

interface MacbookScrollSectionProps {
  title?: string;
  image?: any;
  video?: any;
  show_gradient?: boolean;
}

function resolveMedia(m: any): string | undefined {
  if (!m) return undefined;
  if (typeof m === 'string') return strapiImage(m);
  if (m?.url) return strapiImage(m.url);
  if (m?.filename) return strapiImage(`/media/${m.filename}`);
  return undefined;
}

export function MacbookScrollSection({ title, image, video, show_gradient }: MacbookScrollSectionProps) {
  const src = resolveMedia(image);
  const videoSrc = resolveMedia(video);

  return (
    <div className="px-0 md:px-2">
      <div className="relative w-full overflow-hidden rounded-none md:rounded-3xl bg-white dark:bg-[#0B0B0F]">
        <MacbookScroll
          title={title}
          src={src}
          videoSrc={videoSrc}
          showGradient={show_gradient ?? false}
        />
      </div>
    </div>
  );
}
