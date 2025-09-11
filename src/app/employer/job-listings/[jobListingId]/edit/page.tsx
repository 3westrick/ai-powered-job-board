import { Card, CardContent } from "@/components/ui/card"
import { getJobListing } from "@/features/jobListings/actions"
import { JobListingForm } from "@/features/jobListings/components/job-listing-form"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import { forbidden, notFound } from "next/navigation"
import { Suspense } from "react"
type Props = {
    params: Promise<{ jobListingId: string }>
}
export default async function EmployerJobListingsEditPage(props: Props) {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Edit Job Listing</h1>
            <p className="text-muted-foreground mb-6">
                This does not post the listing yet. It just saves a draft. You
                can always edit the listing later.
            </p>
            <Card>
                <CardContent>
                    <Suspense>
                        <EmployerJobListingsEditPageSuspense {...props} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

async function EmployerJobListingsEditPageSuspense(props: Props) {
    const [{ jobListingId }, { orgId }] = await Promise.all([
        props.params,
        getCurrentOrg(),
    ])
    if (orgId == null) return forbidden()
    const jobListing = await getJobListing(jobListingId, orgId)
    if (jobListing == null) return notFound()

    return <JobListingForm jobListing={jobListing} />
}
