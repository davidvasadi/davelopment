// components/seo/JsonLd.tsx
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://davelopment.hu').replace(/\/+$/, '');

type Props = {
  data: string | Record<string, any> | null | undefined;
};

export default function JsonLd({ data }: Props) {
  if (!data) return null;

  const raw = typeof data === 'string' ? data : JSON.stringify(data);

  // Defensive: strip any localhost URL that may have leaked in from CMS-authored
  // structuredData (e.g. Organization url). Google reads these literally, so a
  // stray http://localhost:1337 would break the structured data.
  const json = raw.replace(/https?:\/\/localhost(:\d+)?/g, SITE_URL);

  if (!json || json === 'null' || json === '""') return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
