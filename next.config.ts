import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        useCache: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
