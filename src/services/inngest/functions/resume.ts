import { getUserResumeUrl, updateUserResume } from "@/features/userResumes/db"
import { inngest } from "../client"
import { env } from "@/data/env/server"
import { generateText } from "ai"
import { google } from "@/services/ai-sdk/models/google"

export const createAiSummaryOfUploadedResume = inngest.createFunction(
    {
        id: "app/create-ai-summary-of-uploaded-resume",
        name: "App - Create AI Summary of Uploaded Resume",
    },
    {
        event: "app/resume.uploaded",
    },
    async ({ event, step }) => {
        const userId = event.user.id
        const userResume = await step.run("get-user-resume", async () => {
            return await getUserResumeUrl(userId)
        })

        if (!userResume) return

        const summary = await step.ai.infer("create-ai-summary", {
            model: step.ai.models.gemini({
                model: "gemini-2.5-flash",
                apiKey: env.GEMINI_API_KEY,
            }),
            body: {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                fileData: {
                                    mimeType: "application/pdf",
                                    fileUri: userResume.resumeFileUrl,
                                },
                            },
                            {
                                text: "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
                            },
                        ],
                    },
                ],
            },
        })

        console.log("🚀 ~ summary:", summary)

        // Persist the summary
        await step.run("save-ai-summary", async () => {
            const parts = summary?.candidates?.[0]?.content?.parts ?? []
            const textPart = parts.find(
                (p): p is { text: string } => "text" in p
            )
            console.log("🚀 ~ textPart:", textPart)
            if (!textPart) return
            await updateUserResume(userId, {
                aiSummary: textPart.text,
            })
        })
    }
)
