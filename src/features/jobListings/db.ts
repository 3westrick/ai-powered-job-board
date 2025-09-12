import db from "@/drizzle/db"
import { JobListing, JobListingInsert } from "./lib/types"
import { JobListingTable } from "@/drizzle/schema"
import { revalidateJobListingsCache } from "./cache"
import { eq } from "drizzle-orm"

export async function insertJobListing(jobListing: JobListingInsert) {
    const [insertedJobListing] = await db
        .insert(JobListingTable)
        .values(jobListing)
        .onConflictDoNothing()
        .returning({
            id: JobListingTable.id,
            organizationId: JobListingTable.organizationId,
        })
    revalidateJobListingsCache(
        insertedJobListing.id,
        insertedJobListing.organizationId
    )
    return insertedJobListing
}

export async function updateJobListing(
    id: string,
    jobListing: Partial<JobListingInsert>
) {
    const [updateedJobListing] = await db
        .update(JobListingTable)
        .set(jobListing)
        .where(eq(JobListingTable.id, id))
        .returning({
            id: JobListingTable.id,
            organizationId: JobListingTable.organizationId,
        })
    revalidateJobListingsCache(
        updateedJobListing.id,
        updateedJobListing.organizationId
    )
    return updateedJobListing
}

export async function deleteJobListing(id: string) {
    const [deletedJobListing] = await db
        .delete(JobListingTable)
        .where(eq(JobListingTable.id, id))
        .returning({
            id: JobListingTable.id,
            organizationId: JobListingTable.organizationId,
        })
    revalidateJobListingsCache(
        deletedJobListing.id,
        deletedJobListing.organizationId
    )
}
