"use server"

import z from "zod"
import { jobListingSchema } from "./schema"

export async function createJobListing(
    unsafeData: z.infer<typeof jobListingSchema>
): Promise<{ error: false } | { error: true; message: string }> {
    return {
        error: false,
    }
}

export async function updateJobListing(
    id: string,
    unsafeData: z.infer<typeof jobListingSchema>
): Promise<{ error: false } | { error: true; message: string }> {
    return {
        error: false,
    }
}
