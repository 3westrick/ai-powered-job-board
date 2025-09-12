import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobListingsOrganizationTag } from "./cache"
import db from "@/drizzle/db"
import { and, count, eq } from "drizzle-orm"
import { JobListingTable } from "@/drizzle/schema"
import hasOrgFeature from "@/services/clerk/lib/hasOrgFeature"

export async function hasReachedMaxPublishedJobListings() {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return true
    const publishedJobListingsCount = await getPublishedJobListingsCount(orgId)
    const canPost = await Promise.all([
        hasOrgFeature("post_1_job_listing").then(
            (has) => has && publishedJobListingsCount < 1
        ),
        hasOrgFeature("post_3_job_listings").then(
            (has) => has && publishedJobListingsCount < 3
        ),
        hasOrgFeature("post_15_job_listings").then(
            (has) => has && publishedJobListingsCount < 15
        ),
    ])
    return !canPost.some(Boolean)
}

export async function hasReachedMaxFeaturedJobListings() {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return true
    const publishedJobListingsCount = await getFeaturedJobListingsCount(orgId)
    const canPost = await Promise.all([
        hasOrgFeature("1_featured_job_listing").then(
            (has) => has && publishedJobListingsCount < 1
        ),
        hasOrgFeature("unlimited_featured_jobs_listings"),
    ])
    return !canPost.some(Boolean)
}

async function getPublishedJobListingsCount(orgId: string) {
    "use cache"
    cacheTag(getJobListingsOrganizationTag(orgId))
    const [res] = await db
        .select({ count: count() })
        .from(JobListingTable)
        .where(
            and(
                eq(JobListingTable.organizationId, orgId),
                eq(JobListingTable.status, "published")
            )
        )

    return res?.count ?? 0
}

async function getFeaturedJobListingsCount(orgId: string) {
    "use cache"
    cacheTag(getJobListingsOrganizationTag(orgId))
    const [res] = await db
        .select({ count: count() })
        .from(JobListingTable)
        .where(
            and(
                eq(JobListingTable.organizationId, orgId),
                eq(JobListingTable.isFeatured, true)
            )
        )

    return res?.count ?? 0
}
