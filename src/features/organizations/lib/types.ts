import { OrganizationTable } from "@/drizzle/schema"

export type Organization = typeof OrganizationTable.$inferSelect
export type OrganizationInsert = typeof OrganizationTable.$inferInsert
