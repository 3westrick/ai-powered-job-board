import { UserNotificationSettingsTable } from "@/drizzle/schema"

export type UserNotificationSettingsInsert =
    typeof UserNotificationSettingsTable.$inferInsert
export type UserNotificationSettings =
    typeof UserNotificationSettingsTable.$inferSelect
