import db from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { getUsersIdTag } from "@/features/users/cache"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"

export default async function getCurrentUser({ allData = false } = {}) {
    const { userId, redirectToSignIn } = await auth()
    return {
        userId,
        redirectToSignIn,
        user: allData && userId != null ? await getUser(userId) : undefined,
    }
}

async function getUser(id: string) {
    "use cache"
    cacheTag(getUsersIdTag(id))
    return await db.query.UserTable.findFirst({
        where: eq(UserTable.id, id),
    })
}
