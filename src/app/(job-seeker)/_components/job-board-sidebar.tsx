import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import JobListingFilterForm from "@/features/jobListings/components/job-listing-filter-form"
import { Suspense } from "react"

export default function JobBoardSidebar() {
    return (
        <SidebarGroup className="group-data-[state=collapsed]:hidden">
            <SidebarGroupContent className="px-1">
                <Suspense>
                    <JobListingFilterForm />
                </Suspense>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
