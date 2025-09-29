import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../components/LanguageContext';
import blogDataEn from '../i18n/locales/en/blog.json';
import blogDataHu from '../i18n/locales/hu/blog.json';
import type { BlogPostMap, BlogPost } from '../types';

// Dátum stringek feldolgozása, hogy a magyar formátumot is kezelje
function parseDate(dateString: string): Date {
  // Ha ISO vagy angol, hagyjuk
  if (!dateString.includes('.') || !isNaN(Date.parse(dateString))) return new Date(dateString);

  // Magyar dátum: "2025. február 2."
  const monthMap: Record<string, string> = {
    január: '01',
    február: '02',
    március: '03',
    április: '04',
    május: '05',
    június: '06',
    július: '07',
    augusztus: '08',
    szeptember: '09',
    október: '10',
    november: '11',
    december: '12'
  };
  const match = dateString.match(/^(\d{4})\. ([a-záéíóöőúüű]+) (\d{1,2})\./i);
  if (!match) return new Date(NaN);
  const [, year, monthHu, day] = match;
  const month = monthMap[monthHu.toLowerCase()];
  return new Date(`${year}-${month}-${day.padStart(2, '0')}`);
}


export function BlogPostPage() {
  // Nyelv kezelés, slug paraméter, navigáció és előző nyelv mentése
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const prevLang = useRef(language);

  // Mindkét nyelv blog adatai
  const allData: Record<'en' | 'hu', BlogPostMap> = {
    en: blogDataEn as unknown as BlogPostMap,
    hu: blogDataHu as unknown as BlogPostMap,
  };

  // Aktuális nyelv blogpostjai
  const blogPosts = allData[language];
  // Aktuális blogpost objektum
  const post: BlogPost | undefined = slug ? blogPosts[slug] : undefined;

  // Előző és következő blogpost (slug sorrend alapján)
  const slugs = Object.keys(blogPosts);
  const idx = slugs.indexOf(slug ?? '');
  const prevPost = idx > 0 ? blogPosts[slugs[idx - 1]] : undefined;
  const nextPost = idx < slugs.length - 1 ? blogPosts[slugs[idx + 1]] : undefined;

  // Nyelvváltás esetén slug redirect
  useEffect(() => {
    if (prevLang.current !== language && slug) {
      const prevPosts = allData[prevLang.current];
      const nextPosts = allData[language];

      // Megkeressük az aktuális cikket a slug alapján az előző nyelven
      const prevPost = Object.values(prevPosts).find(p => p.slug === slug);
      if (!prevPost) return;

      // Új slug keresése a másik nyelven
      let targetSlug = '';
      if (language === 'hu' && prevPost.huSlug) targetSlug = prevPost.huSlug;
      if (language === 'en' && prevPost.enSlug) targetSlug = prevPost.enSlug;

      // Ha találtunk cél slugot, átirányítás
      if (targetSlug && nextPosts[targetSlug]) {
        navigate(`/blog/${targetSlug}`, { replace: true });
      }
    }
    prevLang.current = language;
  }, [language, slug, navigate]);

  // Ha nincs post, csak a Footer jelenjen meg
  if (!post) {
    return (
      <div className="w-full min-h-screen">
        <Header />
        Blog post not found.
        <Footer />
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* --- SEO: Meta title és description beállítása --- */}
      <Helmet>
        <title>{post.title} | davelopment blog</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : post.url} />
        {/* Szerző, dátum structured adatokhoz: */}
        <meta name="author" content={post.author.name} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={post.url} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 pt-16 pb-12">
        {/* Fő tartalom: grid elrendezés, reszponzív */}
        <article className="flex flex-col md:grid md:grid-cols-2 md:gap-12" itemScope itemType="http://schema.org/Article">
          {/* Kép blokk - mobilon felül, desktopon bal oldalt sticky */}
          <section className="relative mb-8 md:mb-0">
            <div className="md:sticky md:top-24">
              <figure className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl aspect-square rounded-xl overflow-hidden mx-auto shadow-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  itemProp="image"
                />
                <figcaption className="sr-only">{post.title}</figcaption>
              </figure>
            </div>
          </section>

          {/* Cikk tartalom blokk - mindig a képtől jobbra (desktopon), alatta (mobilon) */}
          <motion.section
            className="flex flex-col px-1 sm:px-4 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            itemProp="articleBody"
          >
            {/* Fejléc blokk: dátum, cím, leírás, szerző, csík */}
            <header className="space-y-4 mb-8 pt-8">
              <time dateTime={parseDate(post.date).toISOString()}
                className="block text-xs sm:text-sm text-black/70" itemProp="datePublished">

                {post.date}</time>
              {/* SEO: csak 1 db h1 a lapon */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black" itemProp="headline">{post.title}</h1>
              <p className="text-lg sm:text-xl text-gray-500" itemProp="description">{post.description}</p>
              {/* Szerző blokk, szerep, csík dísz */}
              <div className="flex items-center space-x-4">
                {/* Kép konténer: csak a kép! */}
                <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                  <img
                    src={'https://davelopment.hu/assets/profile2-CtcR8s0t.jpeg' /* vagy post.author.image */}
                    alt={post.author.name}
                    className=" object-cover"
                    itemProp="author"
                  />
                </div>
                {/* Szöveg blokk: név + szerep */}
                <div>
                  <span className="font-semibold" itemProp="author">{post.author.name}</span>
                  <p className="text-sm text-black/70">{post.author.role}</p>
                  {/* Díszcsíkot ide teheted, ha akarsz */}
                </div>
              </div>

            </header>

            {/* --- SEO: heading hierarchia, tartalom tag-ek --- */}
            <section className="prose prose-lg md:prose-xl border-t pt-8">
              {post.content.map((block, i) => {
                if (block.type === 'paragraph') {
                  return <p className="text-md text-gray-500" key={i}>{block.text}</p>;
                }
                if (block.type === 'heading') {
                  // Helyes heading tag a szint alapján:
                  if (block.level === 1) return <h2 className="text-3xl font-bold mt-8 mb-4" key={i}>{block.text}</h2>;
                  if (block.level === 2) return <h3 className="text-2xl font-semibold mt-6 mb-3" key={i}>{block.text}</h3>;
                  if (block.level === 3) return <h4 className="text-xl font-semibold mt-4 mb-2" key={i}>{block.text}</h4>;
                  // Ne legyen több h1 a főcím után!
                  return null;
                }
                if (block.type === 'list') {
                  return (
                    <ul key={i} className="list-disc pl-6 text-gray-500">
                      {block.items.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                    </ul>
                  );
                }
                return null;
              })}
            </section>

            {/* NEXT & PREVIOUS POSTS blokk (képekkel, h2 headingek SEO miatt) */}
            <nav className="flex flex-col gap-6 mt-16" aria-label="More blog posts">
              {prevPost && (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="relative block rounded-xl overflow-hidden shadow group no-underline"
                  aria-label={`Previous post: ${prevPost.title}`}
                >
                  <img
                    src={prevPost.image}
                    alt={prevPost.title}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition group-hover:blur-sm"
                  />
                  {/* Fekete overlay effekt */}
                  <div className="absolute inset-0 bg-black/40 opacity-60 group-hover:opacity-80 transition"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-white/70 text-xs sm:text-sm mb-2 text-left font-medium block">Previous</span>
                    <h2 className="text-white text-lg sm:text-2xl font-semibold text-left">{prevPost.title}</h2>
                  </div>
                </Link>
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="relative block rounded-xl overflow-hidden shadow group no-underline "
                  aria-label={`Next post: ${nextPost.title}`}
                >
                  <img
                    src={nextPost.image}
                    alt={nextPost.title}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition group-hover:blur-sm"
                  />
                  {/* Fekete overlay effekt */}
                  <div className="absolute inset-0 bg-black/40 opacity-60 group-hover:opacity-80 transition"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end items-end">
                    <span className="text-white/70 text-xs sm:text-sm mb-2 text-right font-medium block"> Next </span>
                    <h2 className="text-white text-lg sm:text-2xl font-semibold text-right">{nextPost.title}</h2>
                  </div>
                </Link>
              )}
            </nav>
          </motion.section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
