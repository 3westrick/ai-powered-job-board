"use client"

import { UploadDropzone } from "@/services/uploadThing/components/upload-thing"
import { useRouter } from "next/navigation"

export function DropzoneClient() {
    const router = useRouter()
    return (
        <UploadDropzone
            endpoint="resumeUploader"
            onClientUploadComplete={() => router.refresh()}
        />
    )
}
