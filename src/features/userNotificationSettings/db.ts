import { UserNotificationSettingsTable } from "@/drizzle/schema"
import { UserNotificationSettingsInsert } from "./lib/types"
import db from "@/drizzle/db"

export async function createOrganizationUserSettings(
    settings: UserNotificationSettingsInsert
) {
    await db
        .insert(UserNotificationSettingsTable)
        .values(settings)
        .onConflictDoNothing()
}
