// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

const exposedApi = {
    onUSBChanged: (callback: (devices: { [key: number]: string }) => void) => {
        ipcRenderer.on('usb-changed', (event, devices, foo) => {
            console.log(event, devices, foo)
            callback(devices)
        })
    },
    onUpdateCounter: (callback: (delta: number) => void) => ipcRenderer.on('update-counter', (_, delta) => callback(delta))
}

contextBridge.exposeInMainWorld('api', exposedApi)

export type BackendApi = typeof exposedApi
