const { contextBridge, ipcRenderer } = require('electron')

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 选择音频文件
  selectAudioFile: () => ipcRenderer.invoke('select-audio-file'),

  // 验证文件路径
  validateFilePath: (filePath) => ipcRenderer.invoke('validate-file-path', filePath),

  // 加载音频文件
  loadAudioFile: (filePath) => ipcRenderer.invoke('load-audio-file', filePath)
})

// 暴露平台信息
contextBridge.exposeInMainWorld('platform', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
}) 