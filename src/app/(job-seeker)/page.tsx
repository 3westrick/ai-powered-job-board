import JobListingItems from "@/features/jobListings/components/job-listing-items"
import { PromiseSearchParams } from "@/lib/types"

export default async function HomePage({
    searchParams,
}: {
    searchParams: PromiseSearchParams
}) {
    return (
        <div className="m-4">
            <JobListingItems searchParams={searchParams} />
        </div>
    )
}
