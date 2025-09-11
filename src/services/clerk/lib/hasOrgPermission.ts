import { auth } from "@clerk/nextjs/server"

type OrgPermission =
    | "job_listings:create_status"
    | "job_listings:create"
    | "job_listings:update"
    | "job_listings:delete"
    | "job_listing_applications:change_rating"
    | "job_listing_applications:change_stages"
    | "post_1_job_listing"
    | "post_3_job_listings"
    | "unlimited_featured_jobs"

export default async function hasOrgPermission(permission: OrgPermission) {
    const { has } = await auth()
    return has({
        permission,
    })
}
