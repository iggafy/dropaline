
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  print: (data) => ipcRenderer.send('print-document', data),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  saveToPDF: (data) => ipcRenderer.invoke('print-to-pdf', data),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});
