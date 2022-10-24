const { app, BrowserWindow, nativeTheme, shell, dialog, Menu } = require('electron')
const path = require('path')
const { fork } = require('child_process');

let win;
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname + '/public', 'preload.js')
    },
  })
  nativeTheme.themeSource = 'system'
  win.loadURL("http://localhost:3000")
}
Menu.setApplicationMenu(false)
app.whenReady().then(() => {
let nebula = fork(path.join(__dirname, './Nebula/app.js'), ['args'], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
}); 
nebula.on('message', (childMessage) => {
  if (childMessage == "SHUTDOWN: EADDRINUSE") {
    console.log("Shutting Down! Reason: EADDRINUSE!")
    let shutDownWarning = dialog.showMessageBoxSync({
        title: 'ERROR: EADDRINUSE!',
        buttons: ['Exit', 'Continue Anyways (Not Recommended!)'],
        type: 'error',
        message: 'ERROR: EADDRINUSE! (Stop Application on port 3000!)',
    });
    console.log(shutDownWarning)
    if (shutDownWarning == 0) {
        app.quit();
    } else if (shutDownWarning == 1) {
        console.log("attempting to recover!")
    }
}
  console.log('log messages from my child', childMessage);
});
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform == 'darwin') { return }
  else {
    app.quit()
  }
})
