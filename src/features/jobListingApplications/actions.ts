"use server"
import z from "zod"
import { newJobListingApplicationSchema } from "./schemas"
import getCurrentUser from "@/services/clerk/lib/getCurrentUser"
import { revalidateJobListingApplicationCache } from "./cache"
import db from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { JobListingTable, UserResumeTable } from "@/drizzle/schema"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getUserResumeIdTag } from "../userResumes/cache"
import { getJobListingsIdTag } from "../jobListings/cache"
import { insertJobListingApplication } from "./db"
import { inngest } from "@/services/inngest/client"

export async function createJobListingApplication(
    jobListingId: string,
    unsafeData: z.infer<typeof newJobListingApplicationSchema>
) {
    const error = {
        error: true,
        message: "you don't have a permission submit an application",
    }

    const { userId } = await getCurrentUser()
    if (userId == null) return error

    const [userResume, jobListing] = await Promise.all([
        getUserResume(userId),
        getPublicJobListing(jobListingId),
    ])

    if (userResume == null || jobListing == null) return error

    const { success, data } =
        newJobListingApplicationSchema.safeParse(unsafeData)
    if (!success) {
        return {
            error: true,
            message: "There was an error submitting your application",
        }
    }

    await insertJobListingApplication({
        jobListingId,
        userId,
        ...data,
    })

    await inngest.send({
        name: "app/jobListingApplication.created",
        data: { jobListingId, userId },
    })

    return {
        error: false,
        message: "Your application has been submitted successfully",
    }
}

async function getUserResume(userId: string) {
    "use cache"
    cacheTag(getUserResumeIdTag(userId))

    return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
            userId: true,
        },
    })
}

async function getPublicJobListing(jobListingId: string) {
    "use cache"
    cacheTag(getJobListingsIdTag(jobListingId))

    return await db.query.JobListingTable.findFirst({
        where: and(
            eq(JobListingTable.id, jobListingId),
            eq(JobListingTable.status, "published")
        ),
    })
}
