import { UserResumeTable } from "@/drizzle/schema"

export type UserResume = typeof UserResumeTable.$inferSelect
export type UserResumeInsert = typeof UserResumeTable.$inferInsert
export type UserResumeInsertWithoutUserid = Omit<UserResumeInsert, "userId">
