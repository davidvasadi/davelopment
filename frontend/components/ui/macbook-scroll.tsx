'use client';
import React, { useRef } from 'react';
import { MotionValue, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from '@tabler/icons-react';

/* ─────────────────────────────────────────────
   iPhone Dynamic Island frame – mobil nézet
───────────────────────────────────────────── */
const IPhoneFrame = ({
  src,
  videoSrc,
  showGradient,
  title,
  contentY,
}: {
  src?: string;
  videoSrc?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  contentY?: MotionValue<string>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-4 gap-4">
      {title && (
        <h2 className="text-center text-2xl font-bold text-neutral-800 dark:text-white">
          {title}
        </h2>
      )}

      {/* Telefon külső váz */}
      <div
        className="relative mx-auto"
        style={{ width: 'min(320px, 78vw)' }}
      >
        {/* Oldalsó gombok – bal (silent + volume) */}
        <div className="absolute -left-[3.5px] top-[80px] w-[3.5px] h-7 rounded-l-full bg-[#1c1c1e]"
          style={{ boxShadow: '-1px 0 3px rgba(0,0,0,0.6)' }} />
        <div className="absolute -left-[3.5px] top-[122px] w-[3.5px] h-10 rounded-l-full bg-[#1c1c1e]"
          style={{ boxShadow: '-1px 0 3px rgba(0,0,0,0.6)' }} />
        <div className="absolute -left-[3.5px] top-[168px] w-[3.5px] h-10 rounded-l-full bg-[#1c1c1e]"
          style={{ boxShadow: '-1px 0 3px rgba(0,0,0,0.6)' }} />

        {/* Action button – bal felső (iPhone 15-stílus) */}
        <div className="absolute -left-[3.5px] top-[44px] w-[3.5px] h-8 rounded-l-full bg-[#1c1c1e]"
          style={{ boxShadow: '-1px 0 3px rgba(0,0,0,0.6)' }} />

        {/* Jobb oldali power gomb */}
        <div className="absolute -right-[3.5px] top-[130px] w-[3.5px] h-14 rounded-r-full bg-[#1c1c1e]"
          style={{ boxShadow: '1px 0 3px rgba(0,0,0,0.6)' }} />

        {/* Fő váz */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #2e2e30 0%, #0d0d0f 45%, #1c1c1e 100%)',
            borderRadius: '46px',
            padding: '3px',
            boxShadow: `
              0 0 0 0.5px #3a3a3c,
              0 30px 70px rgba(0,0,0,0.75),
              0 10px 25px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.10),
              inset 0 -1px 0 rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Belső fekete keret */}
          <div
            className="relative overflow-hidden w-full"
            style={{
              borderRadius: '43px',
              background: '#000',
              aspectRatio: '9/19.5',
            }}
          >
            {/* Tartalom — DI alatt kezdődik, home indicator felett végződik */}
            <div className="absolute inset-x-0 overflow-hidden" style={{ top: '62px', bottom: '24px' }}>
              <motion.div
                className="absolute inset-x-0 top-0 w-full"
                style={{ height: contentY ? '170%' : '100%', ...(contentY ? { y: contentY } : {}) }}
              >
                {videoSrc ? (
                  <video
                    src={videoSrc}
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt="mockup"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                )}
              </motion.div>
            </div>

            {/* Kijelző fény visszaverődés */}
            <div
              className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)',
                borderRadius: '43px 43px 0 0',
              }}
            />

            {/* ── Dynamic Island ── */}
            <div
              className="absolute top-[10px] left-1/2 -translate-x-1/2 z-30"
              style={{
                width: '36%',
                height: '33px',
                background: '#000',
                borderRadius: '20px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 6px 16px rgba(0,0,0,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
              }}
            >
              {/* Kamera modul */}
              <div
                style={{
                  position: 'absolute',
                  right: '18%',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 38% 33%, #152030 0%, #07090c 55%, #000 100%)',
                  boxShadow: '0 0 0 1.5px rgba(255,255,255,0.05), inset 0 0 5px rgba(0,160,255,0.18)',
                }}
              >
                {/* Lencsecsillanás */}
                <div style={{
                  position: 'absolute', top: '18%', left: '18%',
                  width: '32%', height: '32%',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                }} />
              </div>

              {/* Face ID szenzor – apró pont */}
              <div
                style={{
                  position: 'absolute',
                  left: '24%',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#0a0a0c',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
                }}
              />
            </div>

            {/* Status bar — 3-column layout adjacent to Dynamic Island */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center pointer-events-none" style={{ paddingTop: '17px' }}>
              {/* Left: time — right-aligned toward DI */}
              <div className="flex-1 flex justify-end" style={{ paddingRight: '7px' }}>
                <span className="text-white font-semibold" style={{ fontSize: '12px', letterSpacing: '-0.4px' }}>9:41</span>
              </div>
              {/* Center: Dynamic Island placeholder (same width as DI) */}
              <div style={{ width: '38%' }} />
              {/* Right: status icons — left-aligned from DI */}
              <div className="flex-1 flex justify-start items-center gap-[5px]" style={{ paddingLeft: '7px' }}>
                {/* Mobiljel */}
                <svg width="16" height="11" viewBox="0 0 16 11" fill="white">
                  <rect x="0" y="7" width="3" height="4" rx="0.5" />
                  <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.5" />
                  <rect x="9" y="2" width="3" height="9" rx="0.5" />
                  <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" opacity="0.3" />
                </svg>
                {/* WiFi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                  <path d="M7.5 8.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
                  <path d="M3.2 5.5a6.1 6.1 0 0 1 8.6 0" strokeWidth="1.3" stroke="white" fill="none" strokeLinecap="round"/>
                  <path d="M0.5 2.8a10.1 10.1 0 0 1 14 0" strokeWidth="1.3" stroke="white" fill="none" strokeLinecap="round" opacity="0.45"/>
                </svg>
                {/* Akkumulátor */}
                <div className="flex items-center gap-[2px]">
                  <div style={{
                    width: '22px', height: '11px',
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    borderRadius: '3.5px',
                    padding: '1.5px',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <div style={{ width: '78%', height: '100%', background: 'white', borderRadius: '1.5px' }} />
                  </div>
                  <div style={{ width: '2px', height: '5px', background: 'rgba(255,255,255,0.45)', borderRadius: '1px' }} />
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center z-20 pointer-events-none">
              <div style={{
                width: '33%', height: '5px',
                background: 'rgba(255,255,255,0.45)',
                borderRadius: '3px',
              }} />
            </div>

            {showGradient && (
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-black pointer-events-none z-10" />
            )}
          </div>
        </div>

        {/* Padló árnyék */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '65%', height: '22px',
            background: 'rgba(0,0,0,0.28)',
            filter: 'blur(18px)',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Fő MacbookScroll komponens
   Mindkét (mobil + desktop) verzió mindig a DOM-ban van, CSS mutatja/rejti.
   Így a két useScroll ref soha nincs null → nincs "not hydrated" hiba.
───────────────────────────────────────────── */
export const MacbookScroll = ({
  src,
  videoSrc,
  mobileSrc,
  mobileVideoSrc,
  mobileAnimation = 'zoom',
  showGradient,
  title,
}: {
  src?: string;
  videoSrc?: string;
  mobileSrc?: string;
  mobileVideoSrc?: string;
  mobileAnimation?: 'zoom' | 'parallax';
  showGradient?: boolean;
  title?: string | React.ReactNode;
}) => {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);

  // Desktop: progress=0 amikor szekció teteje viewport tetején
  const { scrollYProgress } = useScroll({
    target: desktopRef,
    offset: ['start start', 'end start'],
  });

  // Mobil: progress=0 belépéskor alulról, 1 kilépéskor felülre — raw, nincs spring
  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileRef,
    offset: ['start end', 'end start'],
  });

  // Desktop MacBook animáció
  const scaleX        = useTransform(scrollYProgress, [0, 0.3],         [1.2, 1.5]);
  const scaleY        = useTransform(scrollYProgress, [0, 0.3],         [0.6, 1.5]);
  const translate     = useTransform(scrollYProgress, [0, 1],           [0, 1500]);
  const rotate        = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textOpacity   = useTransform(scrollYProgress, [0, 0.2],  [1, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3],  [0, 100]);

  // Mobil cím: 1→0 ahogy scrollozod el
  const mobileTitleOpacity = useTransform(mobileProgress, [0.35, 0.6], [1, 0]);
  const mobileTitleY       = useTransform(mobileProgress, [0.35, 0.6], [0, -30]);

  // Mobil zoom
  const mobileScale        = useTransform(mobileProgress, [0.05, 0.45], [0.72, 1]);
  const mobilePhoneOpacity = useTransform(mobileProgress, [0.05, 0.38], [0, 1]);

  // Mobil parallax: tartalom felfelé tolódik a telefon belsejében
  const mobileContentY = useTransform(mobileProgress, [0, 1], ['0%', '-55%']);

  const activeSrc      = mobileSrc      ?? src;
  const activeVideoSrc = mobileVideoSrc ?? videoSrc;

  return (
    <>
      {/* ── MOBIL — nincs sticky, normál scroll flow ─────────────────── */}
      <div className="md:hidden">
        <div ref={mobileRef} className="flex flex-col items-center justify-center gap-4 py-16 px-6">
          {title && (
            <motion.h2
              style={{ opacity: mobileTitleOpacity, y: mobileTitleY }}
              className="text-center text-2xl font-bold text-white"
            >
              {title}
            </motion.h2>
          )}
          {mobileAnimation === 'parallax' ? (
            <IPhoneFrame
              src={activeSrc}
              videoSrc={activeVideoSrc}
              showGradient={showGradient}
              contentY={mobileContentY}
            />
          ) : (
            <motion.div style={{ scale: mobileScale, opacity: mobilePhoneOpacity }}>
              <IPhoneFrame src={activeSrc} videoSrc={activeVideoSrc} showGradient={showGradient} />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────────────── */}
      <div
        ref={desktopRef}
        className="hidden md:relative md:flex md:min-h-[200vh] md:shrink-0 md:flex-col md:items-center md:justify-start md:py-40 [perspective:800px]"
      >
        <motion.h2
          style={{ translateY: textTransform, opacity: textOpacity }}
          className="mb-20 text-center text-3xl font-bold text-white"
        >
          {title}
        </motion.h2>

        <Lid src={src} videoSrc={videoSrc} scaleX={scaleX} scaleY={scaleY} rotate={rotate} translate={translate} />

        <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-[#1e1e20]">
          <div className="relative h-10 w-full">
            <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
          </div>
          <div className="relative flex">
            <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
            <div className="mx-auto h-full w-[80%]"><Keypad /></div>
            <div className="mx-auto h-full w-[10%] overflow-hidden"><SpeakerGrid /></div>
          </div>
          <Trackpad />
          <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
          {showGradient && (
            <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Desktop sub-komponensek (változatlanok)
───────────────────────────────────────────── */
const Lid = ({
  scaleX, scaleY, rotate, translate, src, videoSrc,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
  videoSrc?: string;
}) => (
  <div className="relative [perspective:800px]">
    <div
      style={{
        transform: 'perspective(800px) rotateX(-25deg) translateZ(0px)',
        transformOrigin: 'bottom',
        transformStyle: 'preserve-3d',
      }}
      className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
    >
      <div
        style={{ boxShadow: '0px 2px 0px 2px #171717 inset' }}
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
      >
        <span className="text-white text-sm font-semibold tracking-tight">
          [davelopment]<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>®</sup>
        </span>
      </div>
    </div>
    <motion.div
      style={{
        scaleX, scaleY, rotateX: rotate, translateY: translate,
        transformStyle: 'preserve-3d', transformOrigin: 'top',
      }}
      className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
    >
      <div className="absolute inset-0 rounded-lg bg-[#272729]" />
      {videoSrc ? (
        <video src={videoSrc} autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-top" />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="mockup"
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-top" />
      ) : null}
    </motion.div>
  </div>
);

const Trackpad = () => (
  <div className="mx-auto my-1 h-32 w-[40%] rounded-xl"
    style={{ boxShadow: '0px 0px 1px 1px #00000020 inset' }} />
);

const Keypad = () => (
  <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">esc</KBtn>
      <KBtn><IconBrightnessDown className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F1</span></KBtn>
      <KBtn><IconBrightnessUp className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F2</span></KBtn>
      <KBtn><IconTable className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F3</span></KBtn>
      <KBtn><IconSearch className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F4</span></KBtn>
      <KBtn><IconMicrophone className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F5</span></KBtn>
      <KBtn><IconMoon className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F6</span></KBtn>
      <KBtn><IconPlayerTrackPrev className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F7</span></KBtn>
      <KBtn><IconPlayerSkipForward className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F8</span></KBtn>
      <KBtn><IconPlayerTrackNext className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F9</span></KBtn>
      <KBtn><IconVolume3 className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F10</span></KBtn>
      <KBtn><IconVolume2 className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F11</span></KBtn>
      <KBtn><IconVolume className="h-[6px] w-[6px]" /><span className="mt-1 inline-block">F12</span></KBtn>
      <KBtn>
        <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
          <div className="h-full w-full rounded-full bg-black" />
        </div>
      </KBtn>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <KBtn><span className="block">~</span><span className="mt-1 block">`</span></KBtn>
      <KBtn><span className="block">!</span><span className="block">1</span></KBtn>
      <KBtn><span className="block">@</span><span className="block">2</span></KBtn>
      <KBtn><span className="block">#</span><span className="block">3</span></KBtn>
      <KBtn><span className="block">$</span><span className="block">4</span></KBtn>
      <KBtn><span className="block">%</span><span className="block">5</span></KBtn>
      <KBtn><span className="block">^</span><span className="block">6</span></KBtn>
      <KBtn><span className="block">&amp;</span><span className="block">7</span></KBtn>
      <KBtn><span className="block">*</span><span className="block">8</span></KBtn>
      <KBtn><span className="block">(</span><span className="block">9</span></KBtn>
      <KBtn><span className="block">)</span><span className="block">0</span></KBtn>
      <KBtn><span className="block">—</span><span className="block">_</span></KBtn>
      <KBtn><span className="block">+</span><span className="block">=</span></KBtn>
      <KBtn className="w-10 items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">delete</KBtn>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">tab</KBtn>
      {['Q','W','E','R','T','Y','U','I','O','P'].map(k => <KBtn key={k}><span className="block">{k}</span></KBtn>)}
      <KBtn><span className="block">{'{'}</span><span className="block">{'['}</span></KBtn>
      <KBtn><span className="block">{'}'}</span><span className="block">{']'}</span></KBtn>
      <KBtn><span className="block">{'|'}</span><span className="block">{'\\' }</span></KBtn>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <KBtn className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">caps lock</KBtn>
      {['A','S','D','F','G','H','J','K','L'].map(k => <KBtn key={k}><span className="block">{k}</span></KBtn>)}
      <KBtn><span className="block">:</span><span className="block">;</span></KBtn>
      <KBtn><span className="block">&quot;</span><span className="block">&apos;</span></KBtn>
      <KBtn className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">return</KBtn>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <KBtn className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">shift</KBtn>
      {['Z','X','C','V','B','N','M'].map(k => <KBtn key={k}><span className="block">{k}</span></KBtn>)}
      <KBtn><span className="block">{'<'}</span><span className="block">,</span></KBtn>
      <KBtn><span className="block">{'>'}</span><span className="block">.</span></KBtn>
      <KBtn><span className="block">?</span><span className="block">/</span></KBtn>
      <KBtn className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]" childrenClassName="items-end">shift</KBtn>
    </div>
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
      <KBtn childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1"><span className="block">fn</span></div>
        <div className="flex w-full justify-start pl-1"><IconWorld className="h-[6px] w-[6px]" /></div>
      </KBtn>
      <KBtn childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1"><IconChevronUp className="h-[6px] w-[6px]" /></div>
        <div className="flex w-full justify-start pl-1"><span className="block">control</span></div>
      </KBtn>
      <KBtn childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1"><OptionKey className="h-[6px] w-[6px]" /></div>
        <div className="flex w-full justify-start pl-1"><span className="block">option</span></div>
      </KBtn>
      <KBtn className="w-8" childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-end pr-1"><IconCommand className="h-[6px] w-[6px]" /></div>
        <div className="flex w-full justify-start pl-1"><span className="block">command</span></div>
      </KBtn>
      <KBtn className="w-[8.2rem]" />
      <KBtn className="w-8" childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-start pl-1"><IconCommand className="h-[6px] w-[6px]" /></div>
        <div className="flex w-full justify-start pl-1"><span className="block">command</span></div>
      </KBtn>
      <KBtn childrenClassName="h-full justify-between py-[4px]">
        <div className="flex w-full justify-start pl-1"><OptionKey className="h-[6px] w-[6px]" /></div>
        <div className="flex w-full justify-start pl-1"><span className="block">option</span></div>
      </KBtn>
      <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
        <KBtn className="h-3 w-6"><IconCaretUpFilled className="h-[6px] w-[6px]" /></KBtn>
        <div className="flex">
          <KBtn className="h-3 w-6"><IconCaretLeftFilled className="h-[6px] w-[6px]" /></KBtn>
          <KBtn className="h-3 w-6"><IconCaretDownFilled className="h-[6px] w-[6px]" /></KBtn>
          <KBtn className="h-3 w-6"><IconCaretRightFilled className="h-[6px] w-[6px]" /></KBtn>
        </div>
      </div>
    </div>
  </div>
);

const KBtn = ({
  className, children, childrenClassName, backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => (
  <div className={cn('[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform]', backlit && 'bg-white/[0.2] shadow-xl shadow-white')}>
    <div
      className={cn('flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]', className)}
      style={{ boxShadow: '0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset' }}
    >
      <div className={cn('flex w-full flex-col items-center justify-center text-[5px] text-neutral-200', childrenClassName, backlit && 'text-white')}>
        {children}
      </div>
    </div>
  </div>
);

const SpeakerGrid = () => (
  <div
    className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
    style={{ backgroundImage: 'radial-gradient(circle, #08080A 0.5px, transparent 0.5px)', backgroundSize: '3px 3px' }}
  />
);

const OptionKey = ({ className }: { className: string }) => (
  <svg fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2" />
    <polygon stroke="currentColor" strokeWidth={2} points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25" />
    <rect className="st0" width="32" height="32" stroke="none" />
  </svg>
);