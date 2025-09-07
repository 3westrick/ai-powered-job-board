import {
    getGlobalIdTag,
    getGlobalTag,
    getOrganizationsTag,
} from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getJobListingsGlobalTag() {
    return getGlobalTag("jobListings")
}

export function getJobListingsOrganizationTag(organizationId: string) {
    return getOrganizationsTag("jobListings", organizationId)
}

export function getJobListingsIdTag(id: string) {
    return getGlobalIdTag("jobListings", id)
}

export function revalidateJobListingsCache(id: string, organizationId: string) {
    revalidateTag(getJobListingsGlobalTag())
    revalidateTag(getJobListingsIdTag(id))
    revalidateTag(getJobListingsOrganizationTag(organizationId))
}
