import { getGlobalIdTag, getGlobalTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUserResumeGlobalTag() {
    return getGlobalTag("userResumes")
}

export function getUserResumeIdTag(id: string) {
    return getGlobalIdTag("userResumes", id)
}

export function revalidateUserResumeCache(id: string) {
    revalidateTag(getUserResumeGlobalTag())
    revalidateTag(getUserResumeIdTag(id))
}
