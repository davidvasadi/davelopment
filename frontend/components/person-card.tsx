import React from 'react';
import Image from 'next/image';

/**
 * Személyes kártya (fotó · szerep · cég · név · gomb) — a főoldali hero jobb alsó kártyája; a gépes menü is ezt
 * mutatja a jobb alsó sarokban. A gombot a hívó adja (`action`), hogy a saját linkje és mérése maradjon.
 */
export function PersonCard({ name, role, org, imageUrl, action, priority = false, className = '' }: {
  name: string;
  role?: string;
  org?: string;
  imageUrl?: string | null;
  action?: React.ReactNode;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-white/95 backdrop-blur rounded-card p-2 md:p-3 w-fit max-w-full flex items-center gap-4 md:gap-6 shadow-2xl border border-white/30 text-gray-900 ${className}`}>
      <div className="w-20 md:w-28 self-stretch shrink-0 rounded-2xl md:rounded-xl overflow-hidden bg-gray-200">
        {imageUrl
          ? <Image src={imageUrl} alt={name} width={160} height={160} className="h-full w-full object-cover" priority={priority} />
          : <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />}
      </div>
      <div className="min-w-0 flex flex-col gap-1">
        {role && <div className="text-sm text-gray-500 leading-tight">{role}</div>}
        {org && <div className="text-xs text-gray-400 leading-tight">{org}</div>}
        <div className="text-lg md:text-2xl font-bold truncate">{name}</div>
        {action}
      </div>
    </div>
  );
}
