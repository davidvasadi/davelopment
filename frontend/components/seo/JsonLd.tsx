// components/seo/JsonLd.tsx
type Props = {
  data: string | Record<string, any> | null | undefined;
};

export default function JsonLd({ data }: Props) {
  if (!data) return null;

  const json = typeof data === 'string' ? data : JSON.stringify(data);

  // Üres vagy null string esetén skip
  if (!json || json === 'null' || json === '""') return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
