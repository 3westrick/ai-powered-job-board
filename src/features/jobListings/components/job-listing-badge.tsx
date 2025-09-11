import { Badge } from "@/components/ui/badge"
import { JobListingTable } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { ComponentProps } from "react"
import {
    formatExperienceLevel,
    formatJobListingLocation,
    formatJobType,
    formatLocationRequirement,
    formatWage,
} from "../lib/formatters"
import {
    BanknoteIcon,
    BuildingIcon,
    GraduationCapIcon,
    HourglassIcon,
    MapPinIcon,
} from "lucide-react"

export function JobListingBadges({
    jobListing: {
        wage,
        wageInterval,
        stateAbbreviation,
        city,
        type,
        experienceLevel,
        locationRequirement,
        isFeatured,
    },
    className,
}: {
    jobListing: Pick<
        typeof JobListingTable.$inferSelect,
        | "wage"
        | "wageInterval"
        | "stateAbbreviation"
        | "city"
        | "type"
        | "experienceLevel"
        | "locationRequirement"
        | "isFeatured"
    >
    className?: string
}) {
    const badgeProps = {
        variant: "outline",
        className,
    } satisfies ComponentProps<typeof Badge>

    return (
        <>
            {true && (
                <Badge
                    {...badgeProps}
                    className={cn(
                        className,
                        "dark:border-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-950-foreground border-emerald-200 bg-emerald-200/50 text-emerald-200-foreground"
                    )}
                >
                    Featured
                </Badge>
            )}
            {wage != null && wageInterval != null && (
                <Badge {...badgeProps}>
                    <BanknoteIcon />
                    {formatWage(wage, wageInterval)}
                </Badge>
            )}
            {(stateAbbreviation != null || city != null) && (
                <Badge {...badgeProps}>
                    <MapPinIcon className="size-10" />
                    {formatJobListingLocation({ stateAbbreviation, city })}
                </Badge>
            )}
            <Badge {...badgeProps}>
                <BuildingIcon />
                {formatLocationRequirement(locationRequirement)}
            </Badge>
            <Badge {...badgeProps}>
                <HourglassIcon />
                {formatJobType(type)}
            </Badge>
            <Badge {...badgeProps}>
                <GraduationCapIcon />
                {formatExperienceLevel(experienceLevel)}
            </Badge>
        </>
    )
}
