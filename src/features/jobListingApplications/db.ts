import db from "@/drizzle/db"
import { JobListingApplicationTable } from "@/drizzle/schema"
import { revalidateJobListingApplicationCache } from "./cache"
import { JobListingApplicationInsert } from "./lib/types"
import { and, eq } from "drizzle-orm"

export async function insertJobListingApplication(
    jobListingApplication: JobListingApplicationInsert
) {
    await db.insert(JobListingApplicationTable).values(jobListingApplication)

    revalidateJobListingApplicationCache(jobListingApplication)
}
export async function updateJobListingApplication(
    {
        jobListingId,
        userId,
    }: {
        jobListingId: string
        userId: string
    },
    data: Partial<typeof JobListingApplicationTable.$inferInsert>
) {
    await db
        .update(JobListingApplicationTable)
        .set(data)
        .where(
            and(
                eq(JobListingApplicationTable.jobListingId, jobListingId),
                eq(JobListingApplicationTable.userId, userId)
            )
        )

    revalidateJobListingApplicationCache({ jobListingId, userId })
}
