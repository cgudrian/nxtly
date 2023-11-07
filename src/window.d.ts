import type { BackendApi } from './preload'

declare global {
    interface Window {
        api: BackendApi
    }
}
