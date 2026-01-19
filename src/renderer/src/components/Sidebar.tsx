import React from 'react';
import { 
  makeStyles, 
  shorthands, 
  Button, 
  Text,
  tokens
} from '@fluentui/react-components';
import { useAppStore } from '../store/useAppStore';
import { 
  GridDots24Regular, 
  WeatherMoon24Regular, 
  WeatherSunny24Regular 
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    width: '250px',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke1),
  },
  header: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pluginList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    gap: '4px',
    flexGrow: 1,
  },
  footer: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
  },
  pluginItem: {
    justifyContent: 'flex-start',
    textAlign: 'left',
  }
});

export const Sidebar: React.FC = () => {
  const styles = useStyles();
  const plugins = useAppStore((state) => state.plugins);
  const openTab = useAppStore((state) => state.openTab);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <GridDots24Regular />
        <Text weight="bold" size={400}>DevBoop</Text>
      </div>
      <div className={styles.pluginList}>
        <Text size={300} weight="semibold" style={{ padding: '0 8px 8px 8px' }}>工具箱</Text>
        {plugins.map((plugin) => (
          <Button
            key={plugin.id}
            appearance="subtle"
            icon={plugin.icon || <GridDots24Regular />}
            className={styles.pluginItem}
            onClick={() => openTab(plugin.id)}
          >
            {plugin.name}
          </Button>
        ))}
        {plugins.length === 0 && (
          <Text size={200} style={{ padding: '8px', opacity: 0.6 }}>
            未加载工具
          </Text>
        )}
      </div>
      <div className={styles.footer}>
        <Button 
          appearance="subtle"
          icon={theme === 'dark' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
        </Button>
      </div>
    </div>
  );
};
