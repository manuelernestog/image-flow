import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  processImage: (imageBuffer: ArrayBuffer, options: any) => {
    return ipcRenderer.invoke('process-image', imageBuffer, options);
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('appPath', ipcRenderer.invoke('appPath'));
    contextBridge.exposeInMainWorld('isPackaged', ipcRenderer.invoke('isPackaged'));
    contextBridge.exposeInMainWorld('machineId', ipcRenderer.invoke('machineId'));
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
