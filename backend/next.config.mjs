import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty'],
}

const config = withPayload(nextConfig)

// withPayload always injects `turbopack: {}` which opts Next.js 16 into Turbopack builds.
// Turbopack externalises pino with a hash ID that can't be resolved at runtime.
// Removing the key forces webpack, where serverExternalPackages works correctly.
delete config.turbopack

export default config
