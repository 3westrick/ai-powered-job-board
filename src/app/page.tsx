import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebarClient from "./_components/app-sidebar-client"
import Link from "next/link"
import { LogInIcon } from "lucide-react"
import { SignedIn, SignedOut } from "@/services/clerk/components/sign-in-status"
import { SidebarUserButton } from "@/features/users/components/sidebar-user-button"

export default function HomePage() {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebarClient>
                <Sidebar collapsible="icon" className="overflow-y-hidden">
                    <SidebarHeader className="flex-row items-center">
                        <SidebarTrigger />
                        <span className="text-xl text-nowrap ">3WT Jobs</span>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarMenu>
                                <SignedOut>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/sign-in">
                                                <LogInIcon />
                                                <span>Sign In</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SignedOut>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SignedIn>
                        <SidebarFooter>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarUserButton />
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </SignedIn>
                </Sidebar>
                <main className="flex-1">Hello</main>
            </AppSidebarClient>
        </SidebarProvider>
    )
}
