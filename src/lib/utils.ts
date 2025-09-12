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
