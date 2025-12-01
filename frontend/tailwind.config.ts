import svgToDataUri from 'mini-svg-data-uri';
// Kis SVG-ket data-URI-vá alakít (base64 helyett optimalizált), hogy háttérként inline tudd használni.

import type { Config } from 'tailwindcss';
// Tailwind típus a confighoz (TS-hez hasznos).

const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');
// A Tailwind beépített utilja: a színtáblát "ellapítja" (pl. { gray: { 100: '#…' } } -> { 'gray-100': '#…' })

const config: Config = {
  // Itt mondod meg a JIT-nek, hogy hol keresse az osztályneveket – csak ezekből generál CSS-t.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Ha src/ könyvtárad van, azt is érdemes ide felvenni (pl. './src/**/*.{…}')
  ],

  theme: {
    extend: {
      // Saját színnevek (Tailwind palettára "rábővítve")
      colors: {
        charcoal: '#f5f5f5',         // nagyon sötét háttér/ink
        lightblack: '#1C1C1C',       // sötétszürke felület
        secondary: '#E6E6E6',        // világos kiegészítő (szöveg/ikon)
        muted: 'var(--neutral-200)', // CSS változóra mutat (lásd a plugin: addVariablesForColors)
        // Megj.: a '--neutral-200' változót a plugin fogja előállítani a Tailwind neutral-200 értékéből
      },

      // Előre definiált, soklépcsős árnyékok — könnyű újrahasznosítani class-ként
      boxShadow: {
        derek: `0px 0px 0px 1px rgb(0 0 0 / 0.06),
        0px 1px 1px -0.5px rgb(0 0 0 / 0.06),
        0px 3px 3px -1.5px rgb(0 0 0 / 0.06), 
        0px 6px 6px -3px rgb(0 0 0 / 0.06),
        0px 12px 12px -6px rgb(0 0 0 / 0.06),
        0px 24px 24px -12px rgb(0 0 0 / 0.06)`,
        aceternity: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },

      // Extra background-image utilok (Tailwind alap: gradient-to-*), itt radial és conic
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      // Egyedi animációk (rövid név -> keyframes + timing)
      animation: {
        move: 'move 5s linear infinite',
        'spin-circle': 'spin-circle 3s linear infinite',
      },

      // Az animációk képkockái
      keyframes: {
        move: {
          '0%': { transform: 'translateX(-200px)' },
          '100%': { transform: 'translateX(200px)' },
        },
        'spin-circle': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },

  plugins: [
    // Mozgó/összecsukó komponensekhez segédosztályok (pl. accordion, collapse, fade)
    require('tailwindcss-animate'),

    // Proza szebb tipográfiája (class: prose) – blog, CMS tartalom
    require('@tailwindcss/typography'),

    // SAJÁT PLUGIN #1: legenerálja az összes Tailwind-színhez a CSS változókat (":root { --gray-100: #… }").
    // Így bárhol használhatod pl. var(--gray-100)-at sima CSS-ben is.
    addVariablesForColors,

    // SAJÁT PLUGIN #2: dinamikus utility-k létrehozása (matchUtilities)
    function ({ matchUtilities, theme }: any) {
      // Háttérrács/pötty pattern utilok bármely színnel:
      matchUtilities(
        {
          // pl. "bg-grid-slate-700" -> grid SVG háttér a megadott színnel (stroke)
          'bg-grid': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          // sűrűbb rács (kisebb cella)
          'bg-grid-small': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          // pöttyözött háttér
          'bg-dot': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
          // vastagabb pötty
          'bg-dot-thick': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
            )}")`,
          }),
        },
        {
          // Milyen színértékeket fogadjon el: a teljes backgroundColor paletta (pl. slate-200, white/10, stb.)
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color', // Engedi az átlátszóságot (/50), és szín-szintaxisokra optimalizál
        }
      );

      // Kiemelő utility: belső (inset) vékony „highlight” vonal a doboz tetején
      matchUtilities(
        {
          // pl. "highlight-rose-400/40"
          highlight: (value: any) => ({
            boxShadow: `inset 0 1px 0 0 ${value}`,
          }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        }
      );
    },
  ],
};

// ===== Saját plugin implementáció =====
function addVariablesForColors({ addBase, theme }: any) {
  // Összes Tailwind szín "ellapítva" (pl. { 'slate-50': '#f8fafc', … })
  let allColors = flattenColorPalette(theme('colors'));

  // { '--slate-50': '#f8fafc', '--neutral-200': '#e5e7eb', … }
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  // Ezeket a változókat betolja a :root-ba, így globálisan elérhetők.
  addBase({
    ':root': newVars,
  });
}

export default config;
