import { auth } from "@clerk/nextjs/server"
import { Suspense } from "react"
import { SidebarUserButtonClient } from "./sidebar-user-button-client"
import getCurrentUser from "@/services/clerk/lib/getCurrentUser"

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
        return null
    }
    return <SidebarUserButtonClient user={user} />
}
