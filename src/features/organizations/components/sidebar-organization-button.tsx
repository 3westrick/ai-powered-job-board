import { Suspense } from "react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOutIcon, UserIcon } from "lucide-react"
import getCurrentUser from "@/services/clerk/lib/getCurrentUser"
import { SignOutButton } from "@/services/clerk/components/auth-button"
import { SidebarOrganizationButtonClient } from "./sidebar-organization-button-client"
import getCurrentOrg from "@/services/clerk/lib/getCurrentOrg"

export function SidebarOrganizationButton() {
    return (
        <Suspense>
            <SidebarOrganizationSuspense />
        </Suspense>
    )
}

async function SidebarOrganizationSuspense() {
    const [{ user }, { organization }] = await Promise.all([
        getCurrentUser({ allData: true }),
        getCurrentOrg({ allData: true }),
    ])

    if (user == null || organization == null) {
        return (
            <SignOutButton>
                <SidebarMenuButton>
                    <LogOutIcon />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SignOutButton>
        )
    }

    return (
        <SidebarOrganizationButtonClient
            user={user}
            organization={organization}
        />
    )
}
