# DevBoop JSON/YAML 转换工具开发计划

## 1. 依赖管理
- **Action**: 安装 `js-yaml` 及其类型定义 `@types/js-yaml`。
- **Reason**: `js-yaml` 是业界标准的 YAML 解析与生成库，稳定且功能强大。

## 2. 目录结构
创建新插件目录：`src/renderer/src/plugins/JsonYamlConverter/`
- `index.tsx`: 主 UI 组件。
- `utils.ts`: 核心转换逻辑（封装 js-yaml）。
- `JsonYamlConverter.test.tsx`: 单元测试。

## 3. 核心逻辑实现 (`utils.ts`)
实现以下功能函数：
- `jsonToYaml(jsonStr: string): string`: 解析 JSON 字符串并转换为 YAML，支持错误捕获。
- `yamlToJson(yamlStr: string, indent: number): string`: 解析 YAML 字符串并转换为 JSON，支持格式化缩进。
- **错误处理**: 捕获解析错误并返回友好的错误信息（包含行号/列号）。

## 4. UI 实现 (`index.tsx`)
采用 Fluent UI 组件库，保持与其他插件一致的风格。
- **布局**: 使用 `Tab` 组件切换转换模式，或者使用双栏布局（左侧输入，右侧输出）。鉴于转换通常需要对比，拟采用 **左右分栏布局**，中间提供操作按钮。
- **功能区域**:
  - **输入区**: `Textarea`，支持粘贴，具备基础的格式验证反馈。
  - **控制区**: 
    - 转换方向切换（JSON -> YAML / YAML -> JSON）。
    - 格式化按钮（Prettify）。
    - 转换按钮（实时转换可选）。
  - **输出区**: `Textarea` (只读)，提供“复制”按钮。
- **状态反馈**: 转换失败时在输入框下方或顶部显示红色错误提示。

## 5. 集成
- **注册插件**: 在 `src/renderer/src/App.tsx` 中引入并注册 `JsonYamlPlugin`。
- **图标**: 使用 `@fluentui/react-icons` 中的 `DocumentData` 或类似图标。

## 6. 测试
- **单元测试**: 
  - 测试合法 JSON/YAML 的互转。
  - 测试非法输入的错误处理。
  - 测试复杂嵌套结构和数组。
  - 测试 UI 组件的基本渲染和交互。

## 7. 交付物
- 源代码 (`src/renderer/src/plugins/JsonYamlConverter`)。
- 更新后的 `package.json`。
- 单元测试报告。
