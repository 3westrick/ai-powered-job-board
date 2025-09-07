type CacheTag =
    | "users"
    | "organizations"
    | "jobListings"
    | "userNotificationSettings"
    | "userResumes"
    | "jobListingApplications"
    | "organizationUserSettings"

export function getGlobalTag(tag: CacheTag) {
    return `global:${tag}` as const
}

export function getGlobalIdTag(tag: CacheTag, id: string) {
    return `id:${id}:${tag}` as const
}

export function getOrganizationsTag(tag: CacheTag, organizationId: string) {
    return `organization:${organizationId}:${tag}` as const
}
