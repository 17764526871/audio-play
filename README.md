# 🎵 音频播放器

一个基于 Electron + Vue 3 的本地音频播放器应用，界面简洁美观，功能实用。
123
## ✨ 功能特性

- 🎯 **文件选择**：支持手动输入路径和文件选择器
- 🎵 **音频播放**：播放/暂停控制
- 📊 **进度控制**：可拖动的进度条，支持跳转
- 🎨 **现代UI**：渐变背景，毛玻璃效果
- 📱 **响应式设计**：适配不同窗口大小
- 🔊 **多格式支持**：MP3、WAV、OGG、AAC、M4A、FLAC

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run electron:serve
```

### 构建应用

```bash
npm run electron:build
```

## 🎯 使用方法

1. **选择音频文件**
   - 点击"📁 选择文件"按钮选择音频文件
   - 或直接在输入框中输入文件路径

2. **加载音频**
   - 点击"加载音频"按钮加载音频文件

3. **播放控制**
   - 点击播放按钮开始播放
   - 再次点击暂停播放

4. **进度控制**
   - 点击进度条任意位置跳转到对应时间点
   - 实时显示当前播放时间和总时长

## 🛠️ 技术架构

- **前端框架**：Vue 3 + Composition API
- **桌面框架**：Electron
- **构建工具**：Vite
- **音频处理**：HTML5 Audio API
- **进程通信**：Electron IPC

## 📁 项目结构

```
audio-player-electron/
├── electron/           # Electron 主进程
│   └── main.js
├── src/               # Vue 前端代码
│   ├── components/    # Vue 组件
│   ├── App.vue       # 根组件
│   ├── main.js       # Vue 入口
│   └── style.css     # 全局样式
├── index.html        # HTML 模板
├── package.json      # 项目配置
└── vite.config.js    # Vite 配置
```

## 🎨 界面预览

应用采用现代化设计：
- 渐变紫色背景
- 毛玻璃效果的播放器面板
- 圆角设计和平滑动画过渡
- 直观的播放控制按钮

## 🔧 开发注意事项

- 确保音频文件路径正确且文件存在
- 支持的音频格式：MP3、WAV、OGG、AAC、M4A、FLAC
- 开发时会自动打开开发者工具
- 生产环境会隐藏开发者工具

## 📝 更新日志

### v1.0.0
- 基础音频播放功能
- 文件选择和路径验证
- 进度条拖动控制
- 现代化UI设计
- 跨平台支持

## 项目状态

✅ **Git推送问题已解决** - 大文件问题已修复，node_modules已正确从版本控制中排除。

## 技术栈

- **前端框架**: Vue 3
- **桌面框架**: Electron
- **构建工具**: Vite
- **语言**: TypeScript

## 开发环境配置

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建应用

```bash
npm run build
```

### 打包为桌面应用

```bash
npm run dist
```

## 项目结构

```
audio-play/
├── src/                # 源代码目录
├── electron/           # Electron主进程代码
├── dist/              # 构建输出目录
├── package.json       # 项目配置文件
├── vite.config.js     # Vite配置文件
└── .gitignore         # Git忽略规则
```

## Git相关说明

### 已解决的问题

1. **大文件推送失败**: 通过git filter-branch清理了包含大文件的历史记录
2. **node_modules被误提交**: 已从版本控制中移除并添加到.gitignore
3. **推送到GitHub受限**: 现在可以正常推送代码到远程仓库

### 最佳实践

- `node_modules` 目录已被正确忽略
- 构建输出目录 `dist` 已被忽略
- 环境变量文件和临时文件已被忽略
- 编辑器配置文件已被忽略

## 注意事项

⚠️ **重要提醒**: 
- 本项目已经过Git历史清理，如果你之前克隆过此仓库，建议重新克隆
- 新的协作者只需要运行 `npm install` 即可安装依赖
- 不要手动提交 `node_modules` 目录

## 贡献指南

1. Fork 此仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 