const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      // 启用上下文隔离以提高安全性
      contextIsolation: true,
      // 禁用 node integration 以提高安全性
      nodeIntegration: false,
      // 启用预加载脚本
      preload: path.join(__dirname, 'preload.js')
    },
    // 设置窗口标题栏样式为默认样式
    titleBarStyle: 'default',
    show: false,
    icon: path.join(__dirname, '../assets/icon.png')
  })

  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 处理文件选择
ipcMain.handle('select-audio-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {
        name: '音频文件',
        extensions: ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac']
      }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

// 验证文件路径
ipcMain.handle('validate-file-path', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath)
    if (stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const supportedExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac']
      return supportedExtensions.includes(ext)
    }
    return false
  } catch (error) {
    return false
  }
})

// 读取音频文件并返回Base64数据
ipcMain.handle('load-audio-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()

    // 根据文件扩展名确定MIME类型
    let mimeType = 'audio/mpeg' // 默认MP3
    switch (ext) {
      case '.wav':
        mimeType = 'audio/wav'
        break
      case '.ogg':
        mimeType = 'audio/ogg'
        break
      case '.aac':
        mimeType = 'audio/aac'
        break
      case '.m4a':
        mimeType = 'audio/mp4'
        break
      case '.flac':
        mimeType = 'audio/flac'
        break
    }

    return {
      data: data.toString('base64'),
      mimeType: mimeType
    }
  } catch (error) {
    throw new Error('文件读取失败: ' + error.message)
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
}) 