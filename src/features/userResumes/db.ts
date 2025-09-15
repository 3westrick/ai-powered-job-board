import db from "@/drizzle/db"
import { UserResumeInsertWithoutUserid } from "./lib/types"
import { UserResumeTable } from "@/drizzle/schema"
import { getUserResumeIdTag, revalidateUserResumeCache } from "./cache"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { eq } from "drizzle-orm"

export async function upsertUserResume(
    userId: string,
    data: UserResumeInsertWithoutUserid
) {
    const [res] = await db
        .insert(UserResumeTable)
        .values({ userId, ...data })
        .onConflictDoUpdate({
            target: UserResumeTable.userId,
            set: data,
        })
        .returning()

    revalidateUserResumeCache(userId)
    return res
}

export async function updateUserResume(
    userId: string,
    data: Partial<UserResumeInsertWithoutUserid>
) {
    await db
        .update(UserResumeTable)
        .set(data)
        .where(eq(UserResumeTable.userId, userId))
    revalidateUserResumeCache(userId)
}

export async function getUserResume(userId: string) {
    "use cache"
    cacheTag(getUserResumeIdTag(userId))

    return db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
    })
}

export async function getUserResumeUrl(userId: string) {
    return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
            resumeFileUrl: true,
        },
    })
}
