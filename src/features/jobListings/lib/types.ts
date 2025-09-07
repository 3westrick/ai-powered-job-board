import { JobListingTable } from "@/drizzle/schema"

export type JobListing = typeof JobListingTable.$inferSelect
export type JobListingInsert = typeof JobListingTable.$inferInsert
