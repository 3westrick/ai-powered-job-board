import { env } from "@/data/env/server"
import { proxyFetch } from "@/lib/proxyFetch"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

const googleOptions: {
    apiKey: string
    fetch?: typeof proxyFetch
} = {
    apiKey: env.GEMINI_API_KEY,
}

if (env.WORK_SPACE == "local") {
    googleOptions.fetch = proxyFetch
}

export const google = createGoogleGenerativeAI(googleOptions)
