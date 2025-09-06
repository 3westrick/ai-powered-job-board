import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        useCache: true,
        dynamicIO: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig
