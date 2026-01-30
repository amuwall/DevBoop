import React, { useEffect } from 'react';
import { FluentProvider, webDarkTheme, webLightTheme, makeStyles, tokens } from '@fluentui/react-components';
import { Settings24Regular } from '@fluentui/react-icons';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { CommandPalette } from './components/CommandPalette';
import { useAppStore } from './store/useAppStore';
import { TimestampPlugin } from './plugins/TimestampConverter';
import { Base64Plugin } from './plugins/Base64Converter';
import { JwtPlugin } from './plugins/JwtTool';
import { JsonYamlPlugin } from './plugins/JsonYamlConverter';
import { Settings } from './components/Settings';
import { IPlugin } from './types/plugin';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  }
});

const SettingsPlugin: IPlugin = {
  id: 'settings-tool',
  name: 'Settings',
  description: 'Application Settings',
  category: 'system',
  icon: <Settings24Regular />,
  component: Settings,
  version: '1.0.0',
  author: 'DevBoop'
};

const App: React.FC = () => {
  const styles = useStyles();
  const theme = useAppStore((state) => state.theme);
  const registerPlugin = useAppStore((state) => state.registerPlugin);

  // Register core plugins on mount
  useEffect(() => {
    registerPlugin(TimestampPlugin);
    registerPlugin(Base64Plugin);
    registerPlugin(JwtPlugin);
    registerPlugin(JsonYamlPlugin);
    registerPlugin(SettingsPlugin);
  }, []);

  // Determine actual theme based on 'system' preference
  const actualTheme = (() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? webDarkTheme : webLightTheme;
    }
    return theme === 'dark' ? webDarkTheme : webLightTheme;
  })();

  return (
    <FluentProvider theme={actualTheme}>
      <div className={styles.container}>
        <Sidebar />
        <Workspace />
        <CommandPalette />
      </div>
    </FluentProvider>
  );
};

export default App;
