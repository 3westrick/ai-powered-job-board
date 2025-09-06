import { OrganizationTable } from "@/drizzle/schema"
import z from "zod"

export type Organization = z.infer<typeof OrganizationTable.$inferSelect>
export type OrganizationInsert = z.infer<typeof OrganizationTable.$inferInsert>
