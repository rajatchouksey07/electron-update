const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: any;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    // win.loadFile('index.html');
    win.loadURL(`file://${__dirname}/dist/electron-update-demo/index.html`);

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// =================================================================================================
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// =================================================================================================

// This is free and unencumbered software released into the public domain.
// See LICENSE for details

const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

//  -------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
// -------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
// autoUpdater.setFeedURL('http://127.0.0.1:8080/server/ngelectron-update-rjt/');

// -------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
// -------------------------------------------------------------------
let template = [];
if (process.platform === 'darwin') {
    // OS X
    const name = app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() { app.quit(); }
            },
        ]
    });
}


// -------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click 'About' to see
// that updates are working.
// -------------------------------------------------------------------
// let win;

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

function createDefaultWindow() {
    win = new BrowserWindow();
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null;
    });
    // win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
    win.loadURL(`file://${__dirname}/dist/electron-update-demo/index.html`);
    return win;
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
    logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    sendStatusToWindow(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});

// app.on('ready', () => {
//     // Create the Menu
//     const menu = Menu.buildFromTemplate(template);
//     Menu.setApplicationMenu(menu);

//     createDefaultWindow();
// });

app.on('window-all-closed', () => {
    app.quit();
});

//
// CHOOSE one of the following options for Auto updates
//

// -------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
// -------------------------------------------------------------------
app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
});

// -------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
// -------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })

// =================================================================================================
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// =================================================================================================

ipcMain.on('checkforversionupdate', (event, data) => {
    try {
        console.log('checkforversionupdate');
        sendStatusToWindow('checkforversionupdate');
        autoUpdater.checkForUpdates();
    } catch (error) {
        console.error(error);
    }
});
