import { getGlobalIdTag, getGlobalTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUsersGlobalTag() {
    return getGlobalTag("users")
}

export function getUsersIdTag(id: string) {
    return getGlobalIdTag("users", id)
}

export function revalidateUserCache(id: string) {
    revalidateTag(getUsersGlobalTag())
    revalidateTag(getUsersIdTag(id))
}
