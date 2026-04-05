// components/seo/JsonLd.tsx
import Script from 'next/script';

type Props = {
  data: string | Record<string, any> | null | undefined;
};

export default function JsonLd({ data }: Props) {
  if (!data) return null;

  const json = typeof data === 'string' ? data : JSON.stringify(data);

  if (!json || json === 'null' || json === '""') return null;

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
