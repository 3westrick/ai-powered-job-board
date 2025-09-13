import db from "@/drizzle/db"
import { JobListingApplicationTable } from "@/drizzle/schema"
import { revalidateJobListingApplicationCache } from "./cache"
import { JobListingApplicationInsert } from "./lib/types"

export async function insertJobListingApplication(
    jobListingApplication: JobListingApplicationInsert
) {
    await db.insert(JobListingApplicationTable).values(jobListingApplication)

    revalidateJobListingApplicationCache(jobListingApplication)
}
