"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"
import AppSidebarClient from "./app-sidebar-client"
import { SignedIn } from "@/services/clerk/components/sign-in-status"

export default function AppSidebar({
    children,
    content,
    footerButton,
}: {
    children: ReactNode
    content: ReactNode
    footerButton: ReactNode
}) {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebarClient>
                <Sidebar collapsible="icon" className="overflow-hidden">
                    <SidebarHeader className="flex-row">
                        <SidebarTrigger />
                        <span className="text-xl text-nowrap">3WT Jobs</span>
                    </SidebarHeader>
                    <SidebarContent>{content}</SidebarContent>
                    <SignedIn>
                        <SidebarFooter>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    {footerButton}
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </SignedIn>
                </Sidebar>
                <main className="flex-1">{children}</main>
            </AppSidebarClient>
        </SidebarProvider>
    )
}
