import { getGlobalIdTag, getGlobalTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getOrganizationsGlobalTag() {
    return getGlobalTag("organizations")
}

export function getOrganizationsIdTag(id: string) {
    return getGlobalIdTag("organizations", id)
}

export function revalidateOrganizationCache(id: string) {
    revalidateTag(getOrganizationsGlobalTag())
    revalidateTag(getOrganizationsIdTag(id))
}
