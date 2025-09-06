import { boolean, varchar } from "drizzle-orm/pg-core"
import { createdAt, createTable, updatedAt } from "../schemaHelper"
import { UserTable } from "./user"
import { relations } from "drizzle-orm"

export const UserNotificationSettingsTable = createTable(
    "user_notification_settings",
    {
        userId: varchar()
            .primaryKey()
            .references(() => UserTable.id),
        newJobEmailNotifications: boolean().notNull().default(false),
        aiPrompt: varchar(),
        createdAt,
        updatedAt,
    }
)

export const userNotificationSettingsRelations = relations(
    UserNotificationSettingsTable,
    ({ one }) => ({
        user: one(UserTable, {
            fields: [UserNotificationSettingsTable.userId],
            references: [UserTable.id],
        }),
    })
)
