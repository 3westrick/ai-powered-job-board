import { env } from "@/data/env/server"
import { createAgent, createNetwork, gemini } from "@inngest/agent-kit"

export const summerizerAgent = createAgent({
    name: "summerizer Agent",
    description: "Provides expert support for summerizing resumes",
    system:
        "You are a summerizer expert. " +
        "You only read the resume and summarize the resume and extract all key skills, experience, and qualifications.",
    model: gemini({
        model: "gemini-2.5-flash",
        apiKey: env.GEMINI_API_KEY,
    }),
})

const network = createNetwork({
    agents: [summerizerAgent],
    defaultModel: gemini({
        model: "gemini-2.5-flash",
        apiKey: env.GEMINI_API_KEY,
    }),
    name: "summerizer Network",
})
