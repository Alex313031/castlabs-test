const { app, BrowserWindow, components, dialog, Menu, nativeTheme } = require('electron');
const path = require('path');
let mainWindow;

const appName = app.getName();
const appVersion = app.getVersion();

require('@electron/remote/main').initialize();

async function createWindow() {
  mainWindow = new BrowserWindow({
    title: appName + ' v' + appVersion,
    useContentSize: true,
    autoHideMenuBar: false,
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      sandbox: false,
      experimentalFeatures: true,
      webviewTag: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    role: 'fileMenu',
    label: 'App',
    submenu: [
      {
        label: 'Go Back',
        accelerator: 'Alt+Left',
        click(item) {
          mainWindow.webContents.goBack();
        }
      },
      {
        label: 'Go Forward',
        accelerator: 'Alt+Right',
        click(item) {
          mainWindow.webContents.goForward();
        }
      },
      {
        label: 'Restart App',
        accelerator: 'CmdorCtrl+Alt+R',
        click() {
          app.relaunch();
          app.quit();
        }
      },
      {
        label: 'Quit App',
        role: 'quit',
      }
    ]
  },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
	  {
        label: 'About App',
        accelerator: 'CmdorCtrl+Alt+A',
        click() {
          const info = [
            appName + ' v' + appVersion
          ]
          dialog.showMessageBox({
            type: 'info',
            title: 'About ' + appName,
            message: info.join('\n'),
            buttons: [('Ok')]
          });
        }
      }
    ]
  }
  ]));
  require('@electron/remote/main').enable(mainWindow.webContents);
  nativeTheme.themeSource = 'dark';
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(async () => {
  await components.whenReady();
  console.log('WidevineCDM component ready.\n Info:', components.status(), '\n');
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
