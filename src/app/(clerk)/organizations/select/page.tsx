import { OrganizationList } from "@clerk/nextjs"
import { Suspense } from "react"

type Props = {
    searchParams: Promise<{ redirect?: string }>
}

export default function OrganizationSelectPage(props: Props) {
    return (
        <Suspense>
            <OrganizationSelectSuspense {...props} />
        </Suspense>
    )
}

async function OrganizationSelectSuspense({ searchParams }: Props) {
    const { redirect } = await searchParams
    const redirectUrl = redirect ?? "/employer"
    return (
        <OrganizationList
            hidePersonal
            hideSlug
            skipInvitationScreen
            afterSelectOrganizationUrl={redirectUrl}
            afterCreateOrganizationUrl={redirectUrl}
        />
    )
}
