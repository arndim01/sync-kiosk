import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import ipc from './ipc/ipc';
import coin from './acceptor/coin';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 800,
    height: 500,
  });
  
  // mainWindow.webContents.on('dom-ready', (event)=> {
  //   let css = '* { cursor: none !important; }';
  //   mainWindow.webContents.insertCSS(css);
  // });
  ipc.init(mainWindow);
  coin.init(mainWindow);

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await mainWindow.loadURL(`http://localhost:${port}/sendmoney`);
    await mainWindow.loadURL(`http://localhost:${port}/transactionform`);
    //mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

// ipcMain.on('ping-pong', (event, arg) => {
//   event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`);
// });

// ipcMain.on('ping-pong-sync', (event, arg) => {
//   event.returnValue = `[ipcMain] "${arg}" received synchronously.`;
// });
