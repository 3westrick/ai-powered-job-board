import { auth } from "@clerk/nextjs/server"

type OrgPermission =
    | "job_listings:change_status"
    | "job_listings:create"
    | "job_listings:update"
    | "job_listings:delete"
    | "job_listing_applications:change_rating"
    | "job_listing_applications:change_stages"
export default async function hasOrgPermission(permission: OrgPermission) {
    const { has } = await auth()
    return has({
        permission,
    })
}
