"use server"

import z from "zod"
import { jobListingSchema } from "./schema"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import { redirect } from "next/navigation"
import { insertJobListing, updateJobListing } from "./db"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobListingsIdTag } from "./cache"
import db from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { JobListingTable } from "@/drizzle/schema"

export async function createJobListing(
    unsafeData: z.infer<typeof jobListingSchema>
): Promise<{ error: false } | { error: true; message: string }> {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) {
        return {
            error: true,
            message: "You don't have permission to create a job listing",
        }
    }
    const { success, data } = jobListingSchema.safeParse(unsafeData)
    if (!success) {
        return {
            error: true,
            message: "There was an error creating the job listing",
        }
    }

    const jobListing = await insertJobListing({
        ...data,
        organizationId: orgId,
        status: "draft",
    })

    redirect(`/employer/job-listings/${jobListing.id}`)
}

export async function editJobListing(
    id: string,
    unsafeData: z.infer<typeof jobListingSchema>
): Promise<{ error: false } | { error: true; message: string }> {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) {
        return {
            error: true,
            message: "You don't have permission to create a job listing",
        }
    }
    const { success, data } = jobListingSchema.safeParse(unsafeData)
    if (!success) {
        return {
            error: true,
            message: "There was an error creating the job listing",
        }
    }
    const jobListing = await getJobListing(id, orgId)
    if (jobListing == null) {
        return {
            error: true,
            message: "Job listing not found",
        }
    }
    const updatedJobListing = await updateJobListing(jobListing.id, data)

    redirect(`/employer/job-listings/${updatedJobListing.id}`)
}

export async function getJobListing(jobListingId: string, orgId: string) {
    "use cache"
    cacheTag(getJobListingsIdTag(jobListingId))
    return await db.query.JobListingTable.findFirst({
        where: and(
            eq(JobListingTable.id, jobListingId),
            eq(JobListingTable.organizationId, orgId)
        ),
    })
}
