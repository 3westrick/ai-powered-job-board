import AppSidebarNavMenuGroup from "@/components/sidebar/app-sidebar-nav-menu-group"
import { BellIcon, FileUserIcon } from "lucide-react"

export default function UserSettingsSidebar() {
    return (
        <AppSidebarNavMenuGroup
            items={[
                {
                    href: "/user-settings/notifications",
                    icon: <BellIcon />,
                    label: "Notifications",
                },
                {
                    href: "/user-settings/resume",
                    icon: <FileUserIcon />,
                    label: "Resume",
                },
            ]}
        />
    )
}
