import { auth } from "@clerk/nextjs/server"

type OrgFeature =
    | "1_featured_job_listing"
    | "post_1_job_listing"
    | "post_3_job_listings"
    | "post_15_job_listings"
    | "unlimited_featured_jobs"

export default async function hasOrgFeature(feature: OrgFeature) {
    const { has } = await auth()
    return has({
        feature,
    })
}
