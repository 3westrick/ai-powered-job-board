"use client"
import { ReactNode } from "react"
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs"
import { buttonVariants } from "@/components/ui/button"

export default function ClerkProvider({ children }: { children: ReactNode }) {
    return <OriginalClerkProvider>{children}</OriginalClerkProvider>
}
