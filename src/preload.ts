// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

const exposedApi = {
    onBricksChanged: (callback: (devices: { [key: number]: string; }) => void) => {
        ipcRenderer.on('bricks-changed', (event, bricks) => {
            callback(bricks);
        });
    },

    onUpdateCounter: (callback: (delta: number) => void) => ipcRenderer.on('update-counter', (_, delta) => callback(delta)),

    compileFile: (source: string): Promise<boolean> => {
        ipcRenderer.invoke('compile-file', source);
        return new Promise((resolve) => {
            ipcRenderer.once('compile-file-success', (_event, success: boolean) => resolve(success));
        });
    },

    buttonPressed: (value: number) => ipcRenderer.sendSync('button-pressed', value)
};

contextBridge.exposeInMainWorld('api', exposedApi);

export type BackendApi = typeof exposedApi;
