"use strict";
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const exposedApi = {
    onUSBChanged: (callback) => electron_1.ipcRenderer.on('usb-changed', (_, devices) => callback(devices)),
};
electron_1.contextBridge.exposeInMainWorld('api', exposedApi);
//# sourceMappingURL=preload.js.map