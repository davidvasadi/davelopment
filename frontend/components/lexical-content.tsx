// components/lexical-content.tsx
// Renders Payload Lexical rich text JSON to React elements.
// Supports: heading, paragraph, list (bullet/number), listitem, text (bold, italic, underline, code), link.
import React from 'react';

// Lexical text format bitmask
const FORMAT = { bold: 1, italic: 2, underline: 4, strikethrough: 8, code: 16 } as const;

function LexicalText({ node }: { node: any }) {
  let content: React.ReactNode = node.text ?? '';
  const fmt = node.format ?? 0;
  if (fmt & FORMAT.code) content = <code>{content}</code>;
  if (fmt & FORMAT.strikethrough) content = <s>{content}</s>;
  if (fmt & FORMAT.underline) content = <u>{content}</u>;
  if (fmt & FORMAT.italic) content = <em>{content}</em>;
  if (fmt & FORMAT.bold) content = <strong>{content}</strong>;
  return <>{content}</>;
}

function LexicalChildren({ nodes }: { nodes: any[] }) {
  return (
    <>
      {(nodes ?? []).map((node, i) => (
        <LexicalNode key={i} node={node} />
      ))}
    </>
  );
}

function LexicalNode({ node }: { node: any }): React.ReactElement | null {
  switch (node.type) {
    case 'text':
      return <LexicalText node={node} />;

    case 'linebreak':
      return <br />;

    case 'link':
      return (
        <a
          href={node.url ?? node.fields?.url ?? '#'}
          target={node.newTab || node.fields?.newTab ? '_blank' : '_self'}
          rel="noopener noreferrer"
        >
          <LexicalChildren nodes={node.children} />
        </a>
      );

    case 'paragraph':
      return (
        <p>
          <LexicalChildren nodes={node.children} />
        </p>
      );

    case 'heading': {
      const Tag = (node.tag ?? 'h2') as keyof JSX.IntrinsicElements;
      return (
        <Tag>
          <LexicalChildren nodes={node.children} />
        </Tag>
      );
    }

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <Tag>
          <LexicalChildren nodes={node.children} />
        </Tag>
      );
    }

    case 'listitem':
      return (
        <li>
          <LexicalChildren nodes={node.children} />
        </li>
      );

    case 'quote':
      return (
        <blockquote>
          <LexicalChildren nodes={node.children} />
        </blockquote>
      );

    case 'horizontalrule':
      return <hr />;

    default:
      if (node.children) {
        return <LexicalChildren nodes={node.children} />;
      }
      return null;
  }
}

interface LexicalContentProps {
  content: { root: any } | null | undefined;
  className?: string;
}

export function LexicalContent({ content, className }: LexicalContentProps) {
  if (!content?.root) return null;
  return (
    <div className={className}>
      <LexicalChildren nodes={content.root.children ?? []} />
    </div>
  );
}
