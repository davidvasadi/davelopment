import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center ">
        <span
          aria-label="[davelopment]®"
          className="relative inline-block select-none align-top text-black dark:text-white antialiased"
          style={{
            fontFamily:
              'var(--font-geist, var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial)',
          }}
        >
          <span className="inline-block text-[clamp(56px,8vw,96px)] leading-none font-semibold tracking-[-0.065em]">
            [davelopment]    
            <span className="pointer-events-none absolute top-0 right-0 translate-x-[110%] -translate-y-[0%] text-[0.62em] leading-none font-semibold">
              ®
            </span>
          </span>
        </span>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          {/* <div className="mb-2 tracking-[-.01em]">
            [davelopment]®{" "}
            
          </div> */}
          <div className="tracking-[-.01em]">
            Fejlesztés alatt.
          </div>
        </ol>


      </main>

    </div>
  );
}
