
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

Menu.setApplicationMenu(null);


ipcMain.handle('get-printers', async () => {
  const win = new BrowserWindow({ show: false });
  const printers = await win.webContents.getPrintersAsync();
  win.close();
  return printers;
});

ipcMain.on('print-document', (event, { html, printerName }) => {
  let printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({
      silent: true,
      printBackground: true,
      deviceName: printerName || ''
    }, (success, failureReason) => {
      if (!success) console.log('Print failed', failureReason);
      printWindow.close();
      printWindow = null;
    });
  });
});

ipcMain.handle('print-to-pdf', async (event, { html, filename }) => {
  const win = new BrowserWindow({ show: false });
  // Set title to avoid data URI in filename
  win.webContents.on('did-finish-load', () => {
    win.setTitle(filename || 'Drop a Line');
  });

  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  const data = await win.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  win.close();

  const { filePath } = await require('electron').dialog.showSaveDialog({
    buttonLabel: 'Save PDF',
    defaultPath: filename || `dropaline-${Date.now()}.pdf`,
    filters: [{ name: 'Adobe PDF', extensions: ['pdf'] }]
  });

  if (filePath) {
    await require('fs').promises.writeFile(filePath, data);
    return true;
  }
  return false;
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: '',
    titleBarStyle: 'hiddenInset', // Mac style integrated title bar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#f5f5f7'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
