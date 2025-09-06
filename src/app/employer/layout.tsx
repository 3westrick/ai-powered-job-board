import AppSidebar from "@/components/sidebar/app-sidebar"
import AppSidebarNavMenuGroup from "@/components/sidebar/app-sidebar-nav-menu-group"
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { SidebarOrganizationButton } from "@/features/organizations/components/sidebar-organization-button"
import { SidebarUserButton } from "@/features/users/components/sidebar-user-button"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"
import {
    BrainCircuitIcon,
    ClipboardListIcon,
    LayoutDashboardIcon,
    LogInIcon,
    PlusIcon,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

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
                        <SidebarGroupAction title="Add Job Listing" asChild>
                            <Link href="/employer/job-listings/new">
                                <PlusIcon />
                                <span className="sr-only">Add Job Listing</span>
                            </Link>
                        </SidebarGroupAction>
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
