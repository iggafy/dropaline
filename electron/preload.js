
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  print: (data) => ipcRenderer.send('print-document', data),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  saveToPDF: (data) => ipcRenderer.invoke('print-to-pdf', data),
  checkUpdates: () => ipcRenderer.invoke('manual-update-check')
});
