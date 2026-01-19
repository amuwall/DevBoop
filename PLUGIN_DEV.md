# Plugin Development Guide

DevToolbox is designed to be easily extensible through plugins. Each tool in the application is a standalone plugin.

## Plugin Structure

A plugin consists of:
1. **Metadata**: ID, name, description, icon, etc.
2. **Component**: A React component that renders the tool's UI.

## Creating a New Plugin

1. Create a new directory in `src/renderer/src/plugins/` (e.g., `MyNewTool`).
2. Create an `index.tsx` file.
3. Implement your tool as a React component.
4. Export a plugin object implementing the `IPlugin` interface.

### Example

```typescript
import React from 'react';
import { IPlugin } from '../../types/plugin';
import { Bundle24Regular } from '@fluentui/react-icons';

const MyToolComponent: React.FC = () => {
  return (
    <div>
      <h1>My New Tool</h1>
      <p>Hello World!</p>
    </div>
  );
};

export const MyNewPlugin: IPlugin = {
  id: 'my-new-tool',
  name: 'My New Tool',
  description: 'A brief description of what this tool does.',
  icon: <Bundle24Regular />,
  component: MyToolComponent,
  version: '1.0.0',
  author: 'Your Name'
};
```

## Registering the Plugin

Currently, plugins need to be manually registered in `src/renderer/src/App.tsx`.

```typescript
// src/renderer/src/App.tsx
import { MyNewPlugin } from './plugins/MyNewTool';

// Inside App component
useEffect(() => {
  registerPlugin(TimestampPlugin);
  registerPlugin(MyNewPlugin); // Add your plugin here
}, []);
```

## UI Guidelines

- Use `@fluentui/react-components` to ensure consistency with the application theme.
- Support both Light and Dark modes (Fluent UI handles this automatically if you use standard tokens).
