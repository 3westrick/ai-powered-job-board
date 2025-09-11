import { ReactNode, Suspense } from "react"

export default function AsyncIf({
    condition,
    children,
    loadingFallback,
    otherwise,
}: {
    condition: () => Promise<boolean>
    children: ReactNode
    loadingFallback?: ReactNode
    otherwise?: ReactNode
}) {
    return (
        <Suspense fallback={loadingFallback}>
            <SuspendedComponent
                condition={condition}
                children={children}
                otherwise={otherwise}
            />
        </Suspense>
    )
}

async function SuspendedComponent({
    condition,
    children,
    otherwise,
}: {
    condition: () => Promise<boolean>
    children: ReactNode
    otherwise?: ReactNode
}) {
    return (await condition()) ? children : otherwise
}
