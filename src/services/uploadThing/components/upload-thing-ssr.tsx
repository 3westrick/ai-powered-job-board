import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { customFileRouter } from "../core"

import { connection } from "next/server"
import { Suspense } from "react"

export function UploadThingSSR() {
    return (
        <Suspense>
            <NextSSRPlugin
                routerConfig={extractRouterConfig(customFileRouter)}
            />
        </Suspense>
    )
}

async function UTSSR() {
    await connection()
    return (
        <NextSSRPlugin routerConfig={extractRouterConfig(customFileRouter)} />
    )
}
