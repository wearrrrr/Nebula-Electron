const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const nebulaWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  nebulaWindow.loadURL('https://tutorialread.beauty')
  nebulaWindow.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})