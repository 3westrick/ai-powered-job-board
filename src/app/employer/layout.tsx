import AsyncIf from "@/components/async-if"
import AppSidebar from "@/components/sidebar/app-sidebar"
import AppSidebarNavMenuGroup from "@/components/sidebar/app-sidebar-nav-menu-group"
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { JobListingStatus } from "@/drizzle/schema"
import { getJobListing, getJobListings } from "@/features/jobListings/actions"
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utils"
import { SidebarOrganizationButton } from "@/features/organizations/components/sidebar-organization-button"
import {} from "@/features/users/components/sidebar-user-button"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import hasOrgPermission from "@/services/clerk/lib/hasOrgPermission"
import { ClipboardListIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { JobListingMenuGroup } from "./_components/job-listing-menu-group"

export default function EmployerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Suspense>
            <EmployerLayoutSuspense>{children}</EmployerLayoutSuspense>
        </Suspense>
    )
}

async function EmployerLayoutSuspense({
    children,
}: {
    children: React.ReactNode
}) {
    const { orgId } = await getCurrentOrg()
    if (orgId == null) return redirect("/organizations/select")
    return (
        <AppSidebar
            content={
                <>
                    <SidebarGroup>
                        <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
                        <AsyncIf
                            condition={() =>
                                hasOrgPermission("job_listings:create")
                            }
                        >
                            <SidebarGroupAction title="Add Job Listing" asChild>
                                <Link href="/employer/job-listings/new">
                                    <PlusIcon />
                                    <span className="sr-only">
                                        Add Job Listing
                                    </span>
                                </Link>
                            </SidebarGroupAction>
                        </AsyncIf>
                        <SidebarGroupContent className=" group-data-[state=collapsed]:hidden">
                            <Suspense>
                                <JobListingMenu orgId={orgId} />
                            </Suspense>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <AppSidebarNavMenuGroup
                        className="mt-auto"
                        items={[
                            {
                                href: "/",
                                icon: <ClipboardListIcon />,
                                label: "Job Board",
                            },
                        ]}
                    />
                </>
            }
            footerButton={<SidebarOrganizationButton />}
        >
            {children}
        </AppSidebar>
    )
}

async function JobListingMenu({ orgId }: { orgId: string }) {
    const jobListings = await getJobListings(orgId)

    if (
        jobListings.length === 0 &&
        (await hasOrgPermission("job_listings:create"))
    ) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/employer/job-listings/new">
                            <PlusIcon />
                            <span>Create your first job listing</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return Object.entries(Object.groupBy(jobListings, (j) => j.status))
        .sort(([a], [b]) => {
            return sortJobListingsByStatus(
                a as JobListingStatus,
                b as JobListingStatus
            )
        })
        .map(([status, jobListings]) => (
            <JobListingMenuGroup
                key={status}
                status={status as JobListingStatus}
                jobListings={jobListings}
            />
        ))
}
