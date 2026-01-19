import React from 'react';
import { 
  makeStyles, 
  TabList, 
  Tab, 
  TabValue,
  Button,
  tokens
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  tabContainer: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  content: {
    flexGrow: 1,
    padding: '20px',
    overflow: 'auto',
  },
  welcome: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: tokens.colorNeutralForeground3,
  }
});

export const Workspace: React.FC = () => {
  const styles = useStyles();
  const { tabs, activeTabId, setActiveTab, closeTab, plugins } = useAppStore();

  const onTabSelect = (_: unknown, data: { value: TabValue }) => {
    setActiveTab(data.value as string);
  };

  const activeTab = tabs.find(t => t.id === activeTabId);
  const ActivePluginComponent = activeTab 
    ? plugins.find(p => p.id === activeTab.pluginId)?.component 
    : null;

  return (
    <div className={styles.root}>
      {tabs.length > 0 && (
        <div className={styles.tabContainer}>
          <TabList selectedValue={activeTabId} onTabSelect={onTabSelect}>
            {tabs.map((tab) => (
              <Tab key={tab.id} value={tab.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {tab.title}
                  <Button
                    appearance="transparent"
                    icon={<Dismiss12Regular />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  />
                </div>
              </Tab>
            ))}
          </TabList>
        </div>
      )}
      
      <div className={styles.content}>
        {ActivePluginComponent ? (
          <ActivePluginComponent />
        ) : (
          <div className={styles.welcome}>
            Select a tool from the sidebar to get started
          </div>
        )}
      </div>
    </div>
  );
};
