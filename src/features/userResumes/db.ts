import db from "@/drizzle/db"
import { UserResumeInsertWithoutUserid } from "./lib/types"
import { UserResumeTable } from "@/drizzle/schema"
import { revalidateUserResumeCache } from "./cache"

export async function upsertUserResume(
    userId: string,
    data: UserResumeInsertWithoutUserid
) {
    await db
        .insert(UserResumeTable)
        .values({ userId, ...data })
        .onConflictDoUpdate({
            target: UserResumeTable.userId,
            set: data,
        })
    revalidateUserResumeCache(userId)
}
