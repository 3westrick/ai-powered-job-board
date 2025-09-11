import { MarkdownPartial } from "@/components/markdown/markdown-partial"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import db from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { getJobListing } from "@/features/jobListings/actions"
import { getJobListingsIdTag } from "@/features/jobListings/cache"
import { JobListingBadges } from "@/features/jobListings/components/job-listing-badge"
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import { and, eq } from "drizzle-orm"
import { EditIcon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { forbidden, notFound } from "next/navigation"
import { Suspense } from "react"

type Props = {
    params: Promise<{ jobListingId: string }>
}

export default function EmployerJobListingsJobListingIdPage(props: Props) {
    return (
        <Suspense>
            <EmployerJobListingsJobListingIdPageSuspense {...props} />
        </Suspense>
    )
}

async function EmployerJobListingsJobListingIdPageSuspense({ params }: Props) {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return forbidden()
    const { jobListingId } = await params
    const jobListing = await getJobListing(jobListingId, orgId)
    if (jobListing == null) return notFound()

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
            <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {jobListing.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>
                            {formatJobListingStatus(jobListing.status)}
                        </Badge>
                        <JobListingBadges jobListing={jobListing} />
                    </div>
                </div>
                <div className="flex items-center gap-2 empty:-mt-4">
                    <Button asChild variant="outline">
                        <Link
                            href={`/employer/job-listings/${jobListing.id}/edit`}
                        >
                            <EditIcon className="size-4" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>
            <MarkdownPartial
                dialogMarkdown={
                    <MarkdownRenderer source={jobListing.description} />
                }
                mainMarkdown={
                    <MarkdownRenderer
                        source={jobListing.description}
                        className="prose-sm"
                    />
                }
                dialogTitle="Description"
            />
        </div>
    )
}
