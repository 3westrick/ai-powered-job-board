import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"
import { SidebarUserButtonClient } from "./sidebar-user-button-client"
import getCurrentUser from "@/services/clerk/lib/getCurrentUser"
import { SignOutButton } from "@/services/clerk/components/auth-button"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"

export function SidebarUserButton() {
    return (
        <Suspense>
            <SidebarUserSuspense />
        </Suspense>
    )
}

async function SidebarUserSuspense() {
    const { user } = await getCurrentUser({ allData: true })
    if (!user) {
        return (
            <SignOutButton>
                <SidebarMenuButton>
                    <LogOutIcon />
                    <span>Sign Out</span>
                </SidebarMenuButton>
            </SignOutButton>
        )
    }
    return <SidebarUserButtonClient user={user} />
}
