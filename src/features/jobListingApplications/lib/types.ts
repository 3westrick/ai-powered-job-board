import { JobListingApplicationTable } from "@/drizzle/schema"

export type JobListingApplication =
    typeof JobListingApplicationTable.$inferSelect
export type JobListingApplicationInsert =
    typeof JobListingApplicationTable.$inferInsert
