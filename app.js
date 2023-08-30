const { app, components, BrowserWindow, Menu } = require('electron');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: false
  });

  // Create The Menubar
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: 'Test App',
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
        click() {
          app.relaunch();
          app.quit();
        }
      },
      {
        label: 'Quit App',
        role: 'quit',
      }
    ]}
  ]));

  mainWindow.loadURL('https://www.google.com/');
}

app.whenReady().then(async () => {
  // Initialize Widevine
  await components.whenReady();
  console.log('WidevineCDM component ready.\n Info:', components.status(), '\n');
  
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
