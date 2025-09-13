import AppSidebar from "@/components/sidebar/app-sidebar"
import AppSidebarNavMenuGroup from "@/components/sidebar/app-sidebar-nav-menu-group"

import { SidebarUserButton } from "@/features/users/components/sidebar-user-button"
import {
    BrainCircuitIcon,
    ClipboardListIcon,
    LayoutDashboardIcon,
    LogInIcon,
} from "lucide-react"
import { ReactNode } from "react"

export default function JobSeekerLayout({
    children,
    sidebar,
}: {
    children: ReactNode
    sidebar: ReactNode
}) {
    return (
        <AppSidebar
            content={
                <>
                    {sidebar}
                    <AppSidebarNavMenuGroup
                        className="mt-auto"
                        items={[
                            {
                                href: "/",
                                icon: <ClipboardListIcon />,
                                label: "Job Board",
                            },
                            {
                                href: "/ai-search",
                                icon: <BrainCircuitIcon />,
                                label: "AI Search",
                            },
                            {
                                href: "/employer",
                                icon: <LayoutDashboardIcon />,
                                label: "Employer Dashboard",
                                authStatus: "signedIn",
                            },
                            {
                                href: "/sign-in",
                                icon: <LogInIcon />,
                                label: "Sign In",
                                authStatus: "signedOut",
                            },
                        ]}
                    />
                </>
            }
            footerButton={<SidebarUserButton />}
        >
            {children}
        </AppSidebar>
    )
}
