此计划旨在从零开始构建基于 Electron 的 Windows 开发工具箱，满足所有核心功能、架构和质量要求。

### 1. 项目初始化与架构搭建 (Project Setup)

* **技术栈**: Electron + Vite + React + TypeScript。

* **UI 库**: 使用 Microsoft 官方 `@fluentui/react-components` 以确保原生的 Fluent Design 风格。

* **目录结构**:

  * `packages/main`: Electron 主进程代码。

  * `packages/preload`: 预加载脚本（安全 IPC）。

  * `packages/renderer`: React 前端 UI。

  * `packages/shared`: 共享类型定义与工具函数。

  * `plugins/`: 存放独立工具插件的目录。

### 2. 核心功能实现 (Core Implementation)

* **插件系统 (Plugin Architecture)**:

  * 定义 `IPlugin` 接口（元数据、渲染组件、生命周期）。

  * 实现 `PluginManager`，支持从 `plugins/` 目录动态加载/卸载模块。

  * 开发 "Plugin SDK" 包，导出必要的类型和钩子函数供第三方使用。

* **主界面 (UI Shell)**:

  * **侧边栏**: 根据已加载插件自动生成导航菜单。

  * **多标签页**: 实现 `TabManager`，支持在主工作区同时打开多个工具实例。

  * **主题切换**: 集成 Fluent UI 的 Theme Provider，支持深色/浅色模式实时切换。

### 3. 工具模块开发 (Tool Development)

* **时间戳转换工具 (Timestamp Converter)**:

  * 实现为首个标准插件。

  * 功能：Unix 时间戳 (秒/毫秒) <-> 本地时间/UTC 时间。

  * UI：输入框实时转换，支持一键复制。

### 4. 质量保证与测试 (QA & Testing)

* **单元测试**: 使用 `Vitest` 测试核心逻辑（插件加载器、时间转换算法）。

* **UI 自动化测试**: 使用 `Playwright` 进行 Electron 应用的端到端测试（启动、切换 Tab、工具交互）。

* **文档**: 编写 `README.md` (用户手册) 和 `PLUGIN_DEV.md` (插件开发指南)。

### 5. 性能优化 (Performance)

* **启动优化**: 使用 Vite 构建，按需加载插件代码。

* **内存控制**: 插件卸载时确保存储和 DOM 完全清理。

