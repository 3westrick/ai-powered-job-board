import AsyncIf from "@/components/async-if"
import { MarkdownPartial } from "@/components/markdown/markdown-partial"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { ActionButton } from "@/components/ui/action-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { JobListingStatus, JobListingTable } from "@/drizzle/schema"
import {
    getJobListing,
    toggleJobListingStatus,
} from "@/features/jobListings/actions"
import { getJobListingsIdTag } from "@/features/jobListings/cache"
import { JobListingBadges } from "@/features/jobListings/components/job-listing-badge"
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters"
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils"
import { hasReachedMaxPublishedJobListings } from "@/features/jobListings/permissions"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import hasOrgFeature from "@/services/clerk/lib/hasOrgFeature"
import hasOrgPermission from "@/services/clerk/lib/hasOrgPermission"
import { and, eq } from "drizzle-orm"
import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { forbidden, notFound } from "next/navigation"
import { ReactNode, Suspense } from "react"

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
                    <AsyncIf
                        condition={() =>
                            hasOrgPermission("job_listings:update")
                        }
                    >
                        <Button asChild variant="outline">
                            <Link
                                href={`/employer/job-listings/${jobListing.id}/edit`}
                            >
                                <EditIcon className="size-4" />
                                Edit
                            </Link>
                        </Button>
                    </AsyncIf>
                    <StatusUpdateButton
                        status={jobListing.status}
                        id={jobListing.id}
                    />
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

function StatusUpdateButton({
    status,
    id,
}: {
    status: JobListingStatus
    id: string
}) {
    const btn = (
        <ActionButton
            action={toggleJobListingStatus.bind(null, id)}
            variant="outline"
            requireAreYouSure={getNextJobListingStatus(status) == "published"}
            areYouSureDescription="This will immediately show this job listing to all users ."
        >
            {statusToggleButtonText(status)}
        </ActionButton>
    )
    return (
        <AsyncIf
            condition={() => hasOrgPermission("job_listings:change_status")}
        >
            {getNextJobListingStatus(status) == "published" ? (
                <AsyncIf
                    condition={async () => {
                        const isMaxed =
                            await hasReachedMaxPublishedJobListings()
                        return !isMaxed
                    }}
                    otherwise={
                        <UpgradePopover
                            buttonText={statusToggleButtonText(status)}
                            popoverText={
                                "You must upgrade your plan to publish morejob listings."
                            }
                        />
                    }
                >
                    {btn}
                </AsyncIf>
            ) : (
                btn
            )}
        </AsyncIf>
    )
}

function UpgradePopover({
    buttonText,
    popoverText,
}: {
    buttonText: ReactNode
    popoverText: ReactNode
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"}>{buttonText}</Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 ">
                {popoverText}
                <Button asChild>
                    <Link href={"/employer/pricing"}>Upgrade Plan</Link>
                </Button>
            </PopoverContent>
        </Popover>
    )
}

function statusToggleButtonText(status: JobListingStatus) {
    switch (status) {
        case "draft":
        case "delisted":
            return (
                <>
                    <EyeIcon className="size-4" />
                    Publish
                </>
            )

        case "published":
            return (
                <>
                    <EyeOffIcon className="size-4" />
                    Delist
                </>
            )
        default:
            throw new Error(
                `Unknown job listing status: ${status satisfies never}`
            )
    }
}
