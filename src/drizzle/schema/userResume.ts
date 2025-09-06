import { varchar } from "drizzle-orm/pg-core"
import { createdAt, createTable, updatedAt } from "../schemaHelper"
import { UserTable } from "./user"
import { relations } from "drizzle-orm"

export const UserResumeTable = createTable("user_resumes", {
    userId: varchar()
        .primaryKey()
        .references(() => UserTable.id),
    resumeFileUrl: varchar().notNull(),
    resumeFileKey: varchar().notNull(),
    aiSummary: varchar(),
    createdAt,
    updatedAt,
})

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserResumeTable.userId],
        references: [UserTable.id],
    }),
}))
