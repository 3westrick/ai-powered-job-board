import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SearchParams } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function convertSearchParamsToString(searchParams: SearchParams) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
        } else {
            params.append(key, value)
        }
    })
    return params.toString()
}

export async function pdfUrlToBase64(url: string): Promise<string> {
    // Fetch the PDF as a buffer
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Convert buffer to Base64
    return buffer.toString("base64")
}
