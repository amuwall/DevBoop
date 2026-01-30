import React from 'react';
import { 
  makeStyles, 
  TabList, 
  Tab, 
  TabValue,
  Button,
  tokens,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { Dashboard } from './Dashboard';

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
  tabWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  content: {
    flexGrow: 1,
    padding: '0', // Dashboard handles its own padding
    overflow: 'hidden', // Let children handle scroll
    display: 'flex',
    flexDirection: 'column',
  },
  scrollable: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
  }
});

export const Workspace: React.FC = () => {
  const styles = useStyles();
  const { tabs, activeTabId, setActiveTab, closeTab, closeOtherTabs, closeAllTabs, plugins } = useAppStore();

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
            {tabs.map((tab) => {
              const plugin = plugins.find(p => p.id === tab.pluginId);
              return (
                <Menu key={tab.id} positioning="below-start" openOnContext>
                  <MenuTrigger disableButtonEnhancement>
                    <Tab value={tab.id}>
                      <div className={styles.tabWrapper}>
                        {plugin?.icon && (
                          <span style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                            {plugin.icon}
                          </span>
                        )}
                        
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
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem onClick={() => closeTab(tab.id)}>Close Tab</MenuItem>
                      <MenuItem onClick={() => closeOtherTabs(tab.id)}>Close Others</MenuItem>
                      <MenuItem onClick={() => closeAllTabs()}>Close All</MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              );
            })}
          </TabList>
        </div>
      )}
      
      <div className={styles.content}>
        {ActivePluginComponent ? (
          <div className={styles.scrollable}>
            <ActivePluginComponent />
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
};
