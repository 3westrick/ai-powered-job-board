import { UserNotificationSettingsTable } from "@/drizzle/schema"
import { UserNotificationSettingsInsert } from "./lib/types"
import db from "@/drizzle/db"
import { revalidateUserNotificationSettingsCache } from "./cache"

export async function createOrganizationUserSettings(
    settings: UserNotificationSettingsInsert
) {
    await db
        .insert(UserNotificationSettingsTable)
        .values(settings)
        .onConflictDoNothing()
    revalidateUserNotificationSettingsCache(settings.userId)
}

export async function updateUserNotificationSettings(
    userId: string,
    settings: Partial<
        Omit<typeof UserNotificationSettingsTable.$inferInsert, "userId">
    >
) {
    await db
        .insert(UserNotificationSettingsTable)
        .values({ ...settings, userId })
        .onConflictDoUpdate({
            target: UserNotificationSettingsTable.userId,
            set: settings,
        })

    revalidateUserNotificationSettingsCache(userId)
}
