/*
 * @Author: phil
 * @Date: 2026-01-30 17:59:53
 */
import { app, BrowserWindow, ipcMain, screen } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let notificationWindow: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    acceptFirstMouse: true,
    icon: path.join(process.env.VITE_PUBLIC, 'avatar.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.setAlwaysOnTop(true, 'screen-saver')

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function createNotificationWindow(message: string) {
  if (notificationWindow) {
    notificationWindow.close()
  }

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize

  notificationWindow = new BrowserWindow({
    width: 400,
    height: 100,
    x: Math.floor((screenWidth - 400) / 2),
    y: Math.floor(screenHeight / 2) - 200,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  notificationWindow.once('ready-to-show', () => {
    notificationWindow?.show()
  })

  notificationWindow.on('closed', () => {
    notificationWindow = null
  })

  if (VITE_DEV_SERVER_URL) {
    notificationWindow.loadURL(`${VITE_DEV_SERVER_URL}#/notification?message=${encodeURIComponent(message)}`)
  } else {
    notificationWindow.loadFile(path.join(RENDERER_DIST, 'index.html'), {
      hash: `#/notification?message=${encodeURIComponent(message)}`
    })
  }

  setTimeout(() => {
    if (notificationWindow && !notificationWindow.isDestroyed()) {
      notificationWindow.close()
    }
  }, 3000)
}

ipcMain.on('show-notification', (_event, message: string) => {
  createNotificationWindow(message)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
