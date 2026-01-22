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
            {tabs.map((tab) => (
              <Menu key={tab.id} positioning="below-start" openOnContext>
                <MenuTrigger disableButtonEnhancement>
                  <Tab value={tab.id}>
                    <div className={styles.tabWrapper}>
                      {/* 占位按钮，用于保持标题居中 */}
                      <Button
                        appearance="transparent"
                        icon={<Dismiss12Regular />}
                        size="small"
                        style={{ visibility: 'hidden' }}
                      />
                      
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
                    <MenuItem onClick={() => closeTab(tab.id)}>关闭当前标签</MenuItem>
                    <MenuItem onClick={() => closeOtherTabs(tab.id)}>关闭其他标签</MenuItem>
                    <MenuItem onClick={() => closeAllTabs()}>关闭所有标签</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            ))}
          </TabList>
        </div>
      )}
      
      <div className={styles.content}>
        {ActivePluginComponent ? (
          <ActivePluginComponent />
        ) : (
          <div className={styles.welcome}>
            请从左侧栏选择一个工具以开始使用
          </div>
        )}
      </div>
    </div>
  );
};
