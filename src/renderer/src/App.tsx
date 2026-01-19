import React, { useEffect } from 'react';
import { FluentProvider, webDarkTheme, webLightTheme, makeStyles, tokens } from '@fluentui/react-components';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { useAppStore } from './store/useAppStore';
import { TimestampPlugin } from './plugins/TimestampConverter';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  }
});

const App: React.FC = () => {
  const styles = useStyles();
  const theme = useAppStore((state) => state.theme);
  const registerPlugin = useAppStore((state) => state.registerPlugin);

  // Register core plugins on mount
  useEffect(() => {
    registerPlugin(TimestampPlugin);
  }, []);

  return (
    <FluentProvider theme={theme === 'dark' ? webDarkTheme : webLightTheme}>
      <div className={styles.container}>
        <Sidebar />
        <Workspace />
      </div>
    </FluentProvider>
  );
};

export default App;
