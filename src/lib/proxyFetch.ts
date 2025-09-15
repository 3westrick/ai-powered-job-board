import { ProxyAgent } from "undici"

const proxy = new ProxyAgent("http://127.0.0.1:1087")

let tempOpt = {}

export const proxyFetch: typeof fetch = (url: any, options) => {
    // console.log("🚀 ~ proxyFetch ~ options:", options)
    // console.log("🚀 ~ proxyFetch ~ url:", url)

    // return fetch(url, options)
    // console.log("🚀 ~ proxyFetch ~ url:", url)
    // console.log(options)
    return fetch(url, { ...options } as any)
}
