# 插件开发指南

DevBoop 旨在通过插件轻松扩展。应用中的每个工具都是一个独立的插件。

## 插件结构

一个插件包含：
1. **元数据**: ID、名称、描述、图标等。
2. **组件**: 一个用于渲染工具 UI 的 React 组件。

## 创建新插件

1. 在 `src/renderer/src/plugins/` 目录下创建一个新目录（例如 `MyNewTool`）。
2. 创建一个 `index.tsx` 文件。
3. 以 React 组件的形式实现你的工具。
4. 导出一个实现了 `IPlugin` 接口的插件对象。

### 示例

```typescript
import React from 'react';
import { IPlugin } from '../../types/plugin';
import { Bundle24Regular } from '@fluentui/react-icons';

const MyToolComponent: React.FC = () => {
  return (
    <div>
      <h1>我的新工具</h1>
      <p>你好，世界！</p>
    </div>
  );
};

export const MyNewPlugin: IPlugin = {
  id: 'my-new-tool',
  name: '我的新工具',
  description: '这是一个关于该工具功能的简短描述。',
  icon: <Bundle24Regular />,
  component: MyToolComponent,
  version: '1.0.0',
  author: '你的名字'
};
```

## 注册插件

目前，插件需要在 `src/renderer/src/App.tsx` 中手动注册。

```typescript
// src/renderer/src/App.tsx
import { MyNewPlugin } from './plugins/MyNewTool';

// Inside App component
useEffect(() => {
  registerPlugin(TimestampPlugin);
  registerPlugin(MyNewPlugin); // 在此处添加你的插件
}, []);
```

## UI 设计规范

- 使用 `@fluentui/react-components` 以确保与应用主题保持一致。
- 支持亮色和暗色模式（如果使用标准 Token，Fluent UI 会自动处理）。
