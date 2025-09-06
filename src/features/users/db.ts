import db from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { UserInsert } from "./lib/types"

export async function insertUser(user: UserInsert) {
    await db.insert(UserTable).values(user).onConflictDoNothing()
}

export async function deleteUser(id: string) {
    await db.delete(UserTable).where(eq(UserTable.id, id))
}
