import type { NextConfig } from "next"
// import { setGlobalDispatcher, ProxyAgent } from "undici"

const nextConfig: NextConfig = {
    experimental: {
        useCache: true,
        authInterrupts: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
// const dispatcher = new ProxyAgent({
//     uri: new URL("http://127.0.0.1:1087").toString(),
// })
// setGlobalDispatcher(dispatcher)
