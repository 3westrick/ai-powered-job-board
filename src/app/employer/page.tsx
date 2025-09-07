import db from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import {
    getJobListingsIdTag,
    getJobListingsOrganizationTag,
} from "@/features/jobListings/cache"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import { desc, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default function EmployerPage() {
    return (
        <Suspense>
            <EmployerPageSuspense />
        </Suspense>
    )
}

async function EmployerPageSuspense() {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return null

    const jobListing = await getMostRecentJobListing(orgId)
    if (jobListing == null) return redirect("/employer/job-listings/new")
    else return redirect(`/employer/job-listings/${jobListing.id}`)
}

async function getMostRecentJobListing(orgId: string) {
    "use cache"
    cacheTag(getJobListingsOrganizationTag(orgId))
    const jobListing = await db.query.JobListingTable.findFirst({
        where: eq(JobListingTable.organizationId, orgId),
        orderBy: desc(JobListingTable.createdAt),
        columns: {
            id: true,
        },
    })
    return jobListing
}
