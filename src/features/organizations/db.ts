import db from "@/drizzle/db"
import { OrganizationTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { OrganizationInsert } from "./lib/types"
import { revalidateOrganizationCache } from "./cache"

export async function insertOrganization(organization: OrganizationInsert) {
    await db
        .insert(OrganizationTable)
        .values(organization)
        .onConflictDoNothing()
    revalidateOrganizationCache(organization.id)
}

export async function updateOrganization(
    organizationId: string,
    organization: Partial<OrganizationInsert>
) {
    await db
        .update(OrganizationTable)
        .set(organization)
        .where(eq(OrganizationTable.id, organizationId))
    revalidateOrganizationCache(organizationId)
}

export async function deleteOrganization(id: string) {
    await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id))
    revalidateOrganizationCache(id)
}
