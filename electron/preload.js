
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  print: (data) => ipcRenderer.send('print-document', data),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  saveToPDF: (html) => ipcRenderer.invoke('print-to-pdf', html)
});
