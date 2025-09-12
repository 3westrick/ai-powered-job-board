"use server"

import z from "zod"
import { jobListingSchema } from "./schema"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import { redirect } from "next/navigation"
import { deleteJobListing, insertJobListing, updateJobListing } from "./db"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobListingsIdTag } from "./cache"
import db from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { JobListingTable } from "@/drizzle/schema"
import hasOrgPermission from "@/services/clerk/lib/hasOrgPermission"
import { getNextJobListingStatus } from "./lib/utils"
import {
    hasReachedMaxFeaturedJobListings,
    hasReachedMaxPublishedJobListings,
} from "./permissions"

export async function createJobListing(
    unsafeData: z.infer<typeof jobListingSchema>
): Promise<{ error: false } | { error: true; message: string }> {
    const { orgId } = await getCurrentOrg()
    if (orgId == null || !(await hasOrgPermission("job_listings:create"))) {
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
    if (orgId == null || !(await hasOrgPermission("job_listings:update"))) {
        return {
            error: true,
            message: "You don't have permission to edit this job listing",
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

export async function toggleJobListingStatus(id: string) {
    const error = {
        error: true,
        message: "You don't have permission to edit a job listing status",
    }
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return error

    const jobListing = await getJobListing(id, orgId)
    if (jobListing == null) return error

    const nextStatus = getNextJobListingStatus(jobListing.status)

    if (!(await hasOrgPermission("job_listings:change_status"))) return error

    if (
        nextStatus == "published" &&
        (await hasReachedMaxPublishedJobListings())
    )
        return error

    const updatedJobListing = await updateJobListing(jobListing.id, {
        status: nextStatus,
        isFeatured: nextStatus == "published" ? undefined : false,
        postedAt:
            nextStatus == "published" && jobListing.postedAt == null
                ? new Date()
                : undefined,
    })
    return {
        error: false,
        message: "Job listing status updated",
    }
}

export async function toggleJobListingFeatured(id: string) {
    const error = {
        error: true,
        message:
            "You don't have permission to update this job listing's status",
    }
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return error

    const jobListing = await getJobListing(id, orgId)
    if (jobListing == null) return error

    const newFeaturedStatus = !jobListing.isFeatured

    if (!(await hasOrgPermission("job_listings:change_status"))) return error

    if (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
        return error

    await updateJobListing(jobListing.id, {
        isFeatured: newFeaturedStatus,
    })
    return {
        error: false,
    }
}

export async function destroyJobListing(id: string) {
    const error = {
        error: true,
        message: "You don't have permission to delete this job listing ",
    }
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return error

    const jobListing = await getJobListing(id, orgId)
    if (jobListing == null) return error

    if (!(await hasOrgPermission("job_listings:delete"))) return error

    await deleteJobListing(id)
    redirect("/employer")
}
