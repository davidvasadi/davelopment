// src/env.d.ts vagy vite-env.d.ts

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // ide írhatod a többit is később
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
