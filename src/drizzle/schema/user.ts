import { varchar } from "drizzle-orm/pg-core"
import { createdAt, createTable, updatedAt } from "../schemaHelper"
import { relations } from "drizzle-orm"
import { UserNotificationSettingsTable } from "./userNotificationSettings"
import { UserResumeTable } from "./userResume"
import { OrganizationUserSettingsTable } from "./organizationUserSettings"

export const UserTable = createTable("users", {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull().unique(),
    imageUrl: varchar().notNull(),
    createdAt,
    updatedAt,
})

export const userRelations = relations(UserTable, ({ one, many }) => ({
    notificationSettings: one(UserNotificationSettingsTable),
    resume: one(UserResumeTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
}))
