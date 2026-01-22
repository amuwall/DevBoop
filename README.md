# DevBoop

一个基于 Electron、React 和 Fluent UI 构建的综合性 Windows 开发工具箱应用程序。

## 功能特性

- **模块化架构**: 基于强大的插件系统构建。
- **现代化界面**: 使用 `@fluentui/react-components` 遵循 Windows 11 Fluent Design 设计原则。
- **核心工具**:
  - **时间戳转换器**: 在 Unix 时间戳（秒/毫秒）和可读日期格式（本地/UTC）之间进行转换。
  - **Base64 转换工具**: 支持文本和文件的 Base64 编码/解码，提供 URL 安全模式及图片预览功能。
  - **JWT 工具箱**: 支持 JWT Token 的生成、解析与签名验证，支持多种算法（HS256, RS256 等）。
  - **JSON/YAML 转换器**: 支持 JSON 与 YAML 格式的实时互转与校验。
- **生产力**:
  - 多标签页支持，可同时处理多个任务。
  - 深色/浅色主题切换。
  - 侧边栏导航。

## 快速开始

### 前置要求

- Node.js (v18+)
- npm

### 安装

1. 克隆仓库。
2. 安装依赖：
   ```bash
   npm install
   ```

### 启动开发环境

以热重载模式启动应用：

```bash
npm run dev
```

### 构建生产版本

构建 Windows 应用程序：

```bash
npm run build
```

## 测试

运行单元测试：

```bash
npm run test
```

## 贡献指南

查看 [PLUGIN_DEV.md](PLUGIN_DEV.md) 了解如何创建新工具。
