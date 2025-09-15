import { LanguageModel, generateText } from "ai"

export async function summerizer({
    model,
    fileUrl,
}: {
    model: LanguageModel
    fileUrl: string
}) {
    const result = await generateText({
        model,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "file",
                        data: new URL(fileUrl),
                        mediaType: "application/pdf",
                    },
                ],
            },
            {
                role: "user",
                content:
                    "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
            },
        ],
    })
    return result.text
}
