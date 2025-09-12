import db from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { PromiseSearchParams } from "@/lib/types"
import { cn, convertSearchParamsToString } from "@/lib/utils"
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm"
import Link from "next/link"
import { Suspense } from "react"
import { JobListing } from "../lib/types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { JobListingBadges } from "./job-listing-badge"
import { Badge } from "@/components/ui/badge"
import { differenceInDays } from "date-fns"
import { connection } from "next/server"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobListingsGlobalTag } from "../cache"

type Props = {
    searchParams: PromiseSearchParams
    params?: Promise<{ jobListingId: string }>
}
export default function JobListingItems(props: Props) {
    return (
        <Suspense>
            <SuspendedComponent {...props} />
        </Suspense>
    )
}

async function SuspendedComponent({ searchParams, params }: Props) {
    const jobListingId = params ? (await params).jobListingId : undefined
    // TODO: zod validate
    const search = await searchParams
    const jobListings = await getJobListings(searchParams, jobListingId)
    if (jobListings.length == 0) {
        return (
            <div className="text-muted-foreground p-4">
                No job listings found
            </div>
        )
    }
    return (
        <div className="space-y-4">
            {jobListings.map((jobListing) => (
                <Link
                    key={jobListing.id}
                    className="block"
                    href={`/job-listings/${
                        jobListing.id
                    }?${convertSearchParamsToString(search)}`}
                >
                    <JobListingItem
                        jobListing={jobListing}
                        organization={jobListing.organization}
                    />
                </Link>
            ))}
        </div>
    )
}

async function getJobListings(
    searchParams: any,
    jobListingId: string | undefined
) {
    "use cache"
    cacheTag(getJobListingsGlobalTag())

    const whereConditions: (SQL | undefined)[] = []
    if (searchParams.title) {
        whereConditions.push(
            ilike(JobListingTable.title, `%${searchParams.title}%`)
        )
    }

    if (searchParams.locationRequirement) {
        whereConditions.push(
            eq(
                JobListingTable.locationRequirement,
                searchParams.locationRequirement
            )
        )
    }

    if (searchParams.city) {
        whereConditions.push(
            ilike(JobListingTable.city, `%${searchParams.city}%`)
        )
    }

    if (searchParams.state) {
        whereConditions.push(
            eq(JobListingTable.stateAbbreviation, searchParams.state)
        )
    }

    if (searchParams.experience) {
        whereConditions.push(
            eq(JobListingTable.experienceLevel, searchParams.experience)
        )
    }

    if (searchParams.type) {
        whereConditions.push(eq(JobListingTable.type, searchParams.type))
    }

    if (searchParams.jobIds) {
        whereConditions.push(
            or(
                ...searchParams.jobIds.map((jobId: string) =>
                    eq(JobListingTable.id, jobId)
                )
            )
        )
    }
    return await db.query.JobListingTable.findMany({
        where: or(
            jobListingId
                ? and(
                      eq(JobListingTable.status, "published"),
                      eq(JobListingTable.id, jobListingId)
                  )
                : undefined,
            and(eq(JobListingTable.status, "published"), ...whereConditions)
        ),
        with: {
            organization: {
                columns: {
                    name: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: [
            desc(JobListingTable.isFeatured),
            desc(JobListingTable.postedAt),
        ],
    })
}

function JobListingItem({
    jobListing,
    organization,
}: {
    jobListing: JobListing
    organization: {
        name: string
        imageUrl: string | null
    }
}) {
    const nameInitials = organization?.name
        .split(" ")
        .splice(0, 4)
        .map((word) => word[0])
        .join("")

    return (
        <Card
            className={cn(
                "@container",
                jobListing.isFeatured &&
                    "dark:border-emerald-950 dark:bg-emerald-950/20 border-emerald-200 bg-emerald-200/20"
            )}
        >
            <CardHeader>
                <div className="flex gap-4">
                    <Avatar className="size-14 @max-sm:hidden">
                        <AvatarImage
                            src={organization.imageUrl ?? undefined}
                            alt={organization.name}
                        />
                        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
                            {nameInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-xl">
                            {jobListing.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {organization.name}
                        </CardDescription>
                        {jobListing.postedAt != null && (
                            <div className="text-sm font-medium text-primary @min-md:hidden">
                                <Suspense
                                    fallback={jobListing.postedAt.toLocaleDateString()}
                                >
                                    <DaysSincePosting
                                        postedAt={jobListing.postedAt}
                                    />
                                </Suspense>
                            </div>
                        )}
                    </div>
                    {jobListing.postedAt != null && (
                        <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
                            <Suspense
                                fallback={jobListing.postedAt.toLocaleDateString()}
                            >
                                <DaysSincePosting
                                    postedAt={jobListing.postedAt}
                                />
                            </Suspense>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <JobListingBadges
                    jobListing={jobListing}
                    className={
                        jobListing.isFeatured ? "border-primary/35" : undefined
                    }
                />
            </CardContent>
        </Card>
    )
}

async function DaysSincePosting({ postedAt }: { postedAt: Date }) {
    await connection()
    const daysSincePosted = differenceInDays(postedAt, Date.now())

    if (daysSincePosted < 2) {
        return <Badge>New</Badge>
    }

    return new Intl.RelativeTimeFormat(undefined, {
        style: "narrow",
        numeric: "always",
    }).format(daysSincePosted, "days")
}
