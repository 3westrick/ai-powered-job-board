import { varchar } from "drizzle-orm/pg-core"
import { createdAt, createTable, updatedAt } from "../schemaHelper"
import { relations } from "drizzle-orm"
import { JobListingTable } from "./jobListing"
import { OrganizationUserSettingsTable } from "./organizationUserSettings"

export const OrganizationTable = createTable("organizations", {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    imageUrl: varchar(),
    createdAt,
    updatedAt,
})

export const organizationRelations = relations(
    OrganizationTable,
    ({ many }) => ({
        jobListings: many(JobListingTable),
        organizationUserSettings: many(OrganizationUserSettingsTable),
    })
)
