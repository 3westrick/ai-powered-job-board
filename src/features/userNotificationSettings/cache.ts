import { getGlobalIdTag, getGlobalTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getUserNotificationSettingsGlobalTag() {
    return getGlobalTag("userNotificationSettings")
}

export function getUserNotificationSettingsIdTag(id: string) {
    return getGlobalIdTag("userNotificationSettings", id)
}

export function revalidateUserNotificationSettingsCache(id: string) {
    revalidateTag(getUserNotificationSettingsGlobalTag())
    revalidateTag(getUserNotificationSettingsIdTag(id))
}
