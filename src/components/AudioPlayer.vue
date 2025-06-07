<template>
  <div class="audio-player">
    <div class="player-container">
      <!-- 标题 -->
      <div class="header">
        <h1 class="title">🎵 音频播放器</h1>
      </div>

      <!-- 文件选择区域 -->
      <div class="file-section">
        <div class="input-group">
          <input
            v-model="filePath"
            type="text"
            placeholder="请输入音频文件路径或点击选择文件"
            class="file-input"
            @keyup.enter="loadAudioFile"
          />
          <button @click="selectFile" class="select-btn">
            📁 选择文件
          </button>
        </div>
        <button 
          @click="loadAudioFile" 
          :disabled="!filePath.trim()"
          class="load-btn"
        >
          加载音频
        </button>
      </div>

      <!-- 音频信息显示 -->
      <div v-if="audioLoaded" class="audio-info">
        <p class="file-name">{{ fileName }}</p>
        <div class="time-info">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="separator">/</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div v-if="audioLoaded" class="progress-section">
        <div class="progress-bar" @click="seekAudio" ref="progressBar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div v-if="audioLoaded" class="controls">
        <button @click="togglePlay" class="play-btn" :class="{ playing: isPlaying }">
          {{ isPlaying ? '⏸️' : '▶️' }}
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
    </div>

    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioElement"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
    ></audio>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')

export default {
  name: 'AudioPlayer',
  data() {
    return {
      filePath: '',
      fileName: '',
      audioLoaded: false,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      errorMessage: '',
      currentBlobUrl: null
    }
  },
  computed: {
    progressPercent() {
      if (this.duration === 0) return 0
      return (this.currentTime / this.duration) * 100
    }
  },
  methods: {
    // 选择文件
    async selectFile() {
      try {
        const selectedPath = await ipcRenderer.invoke('select-audio-file')
        if (selectedPath) {
          this.filePath = selectedPath
          this.errorMessage = ''
        }
      } catch (error) {
        this.errorMessage = '文件选择失败'
      }
    },

    // 加载音频文件
    async loadAudioFile() {
      if (!this.filePath.trim()) {
        this.errorMessage = '请选择音频文件'
        return
      }

      try {
        // 验证文件路径
        const isValid = await ipcRenderer.invoke('validate-file-path', this.filePath)
        if (!isValid) {
          this.errorMessage = '文件不存在或格式不支持'
          return
        }

        // 通过主进程读取音频文件
        const audioData = await ipcRenderer.invoke('load-audio-file', this.filePath)
        
        // 创建Blob URL
        const binaryString = atob(audioData.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        const blob = new Blob([bytes], { type: audioData.mimeType })
        const blobUrl = URL.createObjectURL(blob)
        
        // 清理之前的URL（如果存在）
        if (this.currentBlobUrl) {
          URL.revokeObjectURL(this.currentBlobUrl)
        }
        
        // 设置音频源
        this.$refs.audioElement.src = blobUrl
        this.currentBlobUrl = blobUrl
        this.fileName = this.filePath.split(/[/\\]/).pop()
        this.errorMessage = ''
        
      } catch (error) {
        this.errorMessage = error.message || '音频加载失败'
      }
    },

    // 播放/暂停切换
    togglePlay() {
      const audio = this.$refs.audioElement
      if (this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      this.isPlaying = !this.isPlaying
    },

    // 拖动进度条
    seekAudio(event) {
      const progressBar = this.$refs.progressBar
      const rect = progressBar.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const width = rect.width
      const seekTime = (clickX / width) * this.duration
      
      this.$refs.audioElement.currentTime = seekTime
    },

    // 格式化时间显示
    formatTime(seconds) {
      if (isNaN(seconds)) return '00:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    // 音频元数据加载完成
    onLoadedMetadata() {
      this.duration = this.$refs.audioElement.duration
      this.audioLoaded = true
    },

    // 播放时间更新
    onTimeUpdate() {
      this.currentTime = this.$refs.audioElement.currentTime
    },

    // 播放结束
    onEnded() {
      this.isPlaying = false
      this.currentTime = 0
    },

    // 音频加载错误
    onError() {
      this.errorMessage = '音频文件格式不支持或文件损坏'
      this.audioLoaded = false
    }
  },
  
  // 组件销毁时清理Blob URL
  beforeUnmount() {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl)
    }
  }
}
</script>

<style scoped>
.audio-player {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.player-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.file-section {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.file-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.file-input:focus {
  border-color: #667eea;
}

.select-btn {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
  white-space: nowrap;
}

.select-btn:hover {
  background: #5a6fd8;
}

.load-btn {
  width: 100%;
  padding: 12px;
  background: #764ba2;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;
}

.load-btn:hover:not(:disabled) {
  background: #6a4190;
}

.load-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.audio-info {
  text-align: center;
  margin-bottom: 25px;
}

.file-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  word-break: break-all;
}

.time-info {
  font-size: 14px;
  color: #666;
}

.separator {
  margin: 0 8px;
}

.progress-section {
  margin-bottom: 25px;
}

.progress-bar {
  position: relative;
  height: 6px;
  background: #e1e5e9;
  border-radius: 3px;
  cursor: pointer;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.1s;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: #667eea;
  border: 3px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: left 0.1s;
}

.controls {
  text-align: center;
}

.play-btn {
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 120px;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.play-btn.playing {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.error-message {
  text-align: center;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .player-container {
    padding: 20px;
    margin: 10px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .select-btn {
    width: 100%;
  }
}
</style> 