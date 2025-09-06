"use client"
import { ReactNode } from "react"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar"
import { SignedIn, SignedOut } from "@/services/clerk/components/sign-in-status"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AppSidebarNavMenuGroup({
    items,
    className,
}: {
    items: {
        href: string
        icon: ReactNode
        label: string
        authStatus?: "signedIn" | "signedOut"
    }[]
    className?: string
}) {
    const pathname = usePathname()
    return (
        <SidebarGroup className={className}>
            <SidebarMenu>
                {items.map((item) => {
                    const html = (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === pathname}
                            >
                                <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                    if (item.authStatus === "signedOut") {
                        return <SignedOut key={item.href}>{html}</SignedOut>
                    }
                    if (item.authStatus === "signedIn") {
                        return <SignedIn key={item.href}>{html}</SignedIn>
                    }
                    return html
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
