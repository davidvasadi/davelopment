import { ArrowUpRightIcon, PlusIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React from 'react';
import { strapiImage } from '@/lib/strapi/strapiImage';

type FooterLink = {
  text?: string | null;
  URL?: string | null;
  target?: '_self' | '_blank' | string | null;
};

type FooterFormInput = {
  type?: string | null;
  name?: string | null;
  placeholder?: string | null;
};

type FooterProps = {
  data: {
    // FORM (phone + email itt jön)
    form?: {
      inputs?: FooterFormInput[] | null;
    };

    // COLUMN HEADINGS
    navigation_title?: string | null;
    social_title?: string | null;

    // BOTTOM BAR TEXTS
    description?: string | null;
    copyright?: string | null;
    designed_developed_by?: string | null;
    built_with?: string | null;

    // LINKS
    internal_links?: FooterLink[];
    policy_links?: FooterLink[];
    social_media_links?: FooterLink[];

    // PROFILE media field
    profile?: any | null;
  };
  locale: string;
};

const resolveLinkProps = (link: FooterLink, locale: string) => {
  if (!link?.URL || !link?.text) return null;

  const isExternal = link.URL.startsWith('http');
  const href = isExternal
    ? link.URL
    : `/${locale}${link.URL.startsWith('/') ? link.URL : `/${link.URL}`}`;

  const target =
    link.target && link.target !== '_self' ? link.target : undefined;
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

  return { href, target, rel, isExternal };
};

export const Footer = ({ data, locale }: FooterProps) => {
  const {
    form,
    navigation_title,
    social_title,
    description,
    copyright,
    designed_developed_by,
    built_with,
    internal_links,
    policy_links,
    social_media_links,
    profile,
  } = data ?? {};

  // --- phone + email a form.inputs-ből ---
  const inputs = form?.inputs ?? [];
  const phoneInput =
    inputs.find((i) => i.type === 'phone' || i.type === 'tel') ?? inputs[0];
  const emailInput =
    inputs.find((i) => i.type === 'email') ?? inputs[1];

  const phone = phoneInput?.name ?? '';
  const email = emailInput?.name ?? '';

  // --- profilkép URL Strapi-ból ---
  const profileSrc = profile
    ? strapiImage(
      profile?.url ??
      profile?.data?.attributes?.url ??
      profile?.attributes?.url ??
      profile
    )
    : undefined;

  return (
    <footer className="w-full">
      {/* ========================= ELÉRHETŐSÉG ÉS NAVIGÁCIÓ ========================= */}
      <div className="w-full  py-20">
        <div className="max-w-9xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* ======== CONTACT OSZLOP (balra) ======== */}
            <div className="md:col-span-4 space-y-4">
              <PlusIcon className="w-6 h-6 text-black mb-10" />

              {phone && (
                <a href={`tel:${phone}`}>
                  <p className="text-lg text-black">{phone}</p>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex text-black items-center text-2xl font-medium pb-1 hover:opacity-80 transition-opacity"
                >
                  {/* plusz kör */}
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black">
                    <span className="text-white text-xs transition-transform duration-200 group-hover:rotate-90">
                      <PlusIcon className="w-3 h-3" />
                    </span>
                  </span>

                  {/* email + alatta vonal – alapból látszik, hoverre eltűnik */}
                  <span className="relative inline-block">
                    <span className="relative z-10">{email}</span>
                    <span
                      className="
                                  pointer-events-none
                                  absolute left-0 -bottom-[2px] right-0
                                  h-[2px] bg-black
                                  origin-left
                                  scale-x-100
                                  transition-transform duration-200
                                  group-hover:scale-x-0
                                "
                    />
                  </span>
                </a>
              )}

            </div>

            {/* ======== NAV + SOCIAL BLOKK (jobbra, közelebb egymáshoz) ======== */}
            <div className="md:col-span-8">
              <div className="grid grid-cols-2 gap-6 md:flex md:flex-wrap md:gap-60 md:justify-end lg:justify-center">
                {/* NAVIGATION */}
                <div className="w-1/2 md:w-auto">
                  <PlusIcon className="w-6 h-6 text-black mb-10" />

                  {navigation_title && (
                    <p className="text-sm font-basic text-black mb-4">
                      {navigation_title}
                    </p>
                  )}

                  <ul className="space-y-2">
                    {(internal_links ?? []).map((link, index) => {
                      const resolved = resolveLinkProps(link, locale);
                      if (!resolved) return null;
                      const { href, target, rel, isExternal } = resolved;

                      const inner = (
                        <span className="relative inline-flex items-center">
                          <span className="absolute left-0 h-2 w-2 rounded-full bg-gray-500 opacity-0 scale-0 -translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-transform duration-200" />
                          <span className="transition-transform duration-200 group-hover:translate-x-4">
                            {link.text}
                          </span>
                        </span>
                      );

                      return (
                        <li key={`${link.text}-${index}`}>
                          {isExternal ? (
                            <a
                              href={href}
                              target={target ?? '_blank'}
                              rel={rel ?? 'noopener noreferrer'}
                              className="group inline-flex items-center text-xl font-medium hover:opacity-70 transition-opacity"
                            >
                              {inner}
                            </a>
                          ) : (
                            <Link
                              href={href}
                              target={target}
                              rel={rel}
                              className="group inline-flex items-center text-xl text-black font-medium hover:opacity-70 transition-opacity"
                            >
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* SOCIAL */}
                <div className="w-1/2 md:w-auto">
                  <PlusIcon className="w-6 h-6 text-black mb-10" />

                  {social_title && (
                    <p className="text-sm font-basic text-black mb-4">
                      {social_title}
                    </p>
                  )}

                  <ul className="space-y-2">
                    {(social_media_links ?? []).map((link, index) => {
                      const resolved = resolveLinkProps(link, locale);
                      if (!resolved) return null;
                      const { href, target, rel } = resolved;

                      return (
                        <li key={`${link.text}-${index}`}>
                          <a
                            href={href}
                            target={target ?? '_blank'}
                            rel={rel ?? 'noopener noreferrer'}
                            className="group text-black inline-flex items-start text-xl font-medium hover:opacity-70 transition-opacity"
                          >
                            <span>{link.text}</span>
                            <ArrowUpRightIcon
                              className="ml-1 w-4 h-4 text-gray-500 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-12"
                            />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ======================= NAGY LOGÓ ÉS STUDIO FELIRAT ======================= */}
      <div className="w-full pb-20 text-right">
        <div className="max-w-9xl mx-auto px-6 md:px-8">
          <h2 className="text-black text-[40px] sm:text-[50px] md:text-7xl lg:text-8xl xl:text-9xl font-bold">
            [davelopment]
            <span className=" text-black font-normal rounded-full ">
              <span className="font-semibold">®</span>
            </span>
          </h2>
          <p className="mt-2 text-1xl md:text-3xl xl:text-4xl font-bold "></p>
        </div>
      </div>

      {/* ========================== FEKETE ALSÓ SÁV ========================== */}
      <div className="w-full bg-black text-white py-14">
        <div className="max-w-9xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* ======== BAL: LEÍRÁS + COPYRIGHT ======== */}
            <div className="md:col-span-4 space-y-2">
              {description && (
                <p className="text-sm text-white/70">{description}</p>
              )}
              {copyright && (
                <p className="text-sm text-white/80">{copyright}</p>
              )}
            </div>

            {/* ======== KÖZÉP: JOGI LINKEK ======== */}
            <div className="md:col-span-4 flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-6">
              {(policy_links ?? []).map((link, index) => {
                const resolved = resolveLinkProps(link, locale);
                if (!resolved) return null;
                const { href, target, rel, isExternal } = resolved;

                return isExternal ? (
                  <a
                    key={`${link.text}-${index}`}
                    href={href}
                    target={target ?? '_blank'}
                    rel={rel ?? 'noopener noreferrer'}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                ) : (
                  <Link
                    key={`${link.text}-${index}`}
                    href={href}
                    target={target}
                    rel={rel}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                );
              })}
            </div>

            {/* ======== JOBB: AVATAR + KREDITEK ======== */}
            <div className="md:col-span-4 flex flex-col md:items-start space-y-2">
              {(profileSrc || designed_developed_by) && (
                <div className="flex items-center justify-start md:justify-end gap-2">
                  {profileSrc && (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={profileSrc}
                        alt={designed_developed_by ?? 'Profile'}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  {designed_developed_by && (
                    <p className="text-sm text-white/80">
                      {designed_developed_by}
                    </p>
                  )}
                </div>
              )}

              {built_with && (
                <p className="text-xs text-white/60">{built_with}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
