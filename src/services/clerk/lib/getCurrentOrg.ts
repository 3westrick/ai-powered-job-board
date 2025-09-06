import db from "@/drizzle/db"
import { OrganizationTable } from "@/drizzle/schema"
import { getOrganizationsIdTag } from "@/features/organizations/cache"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"

export default async function getCurrentOrg({ allData = false } = {}) {
    const { orgId, redirectToSignIn } = await auth()
    return {
        orgId,
        redirectToSignIn,
        organization:
            allData && orgId != null ? await getOrg(orgId) : undefined,
    }
}

async function getOrg(id: string) {
    "use cache"
    cacheTag(getOrganizationsIdTag(id))
    return await db.query.OrganizationTable.findFirst({
        where: eq(OrganizationTable.id, id),
    })
}
