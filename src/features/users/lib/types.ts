import { UserTable } from "@/drizzle/schema"

export type UserInsert = typeof UserTable.$inferInsert
export type User = typeof UserTable.$inferSelect
export type UserComponent = {
    name: string
    imageUrl: string
}
