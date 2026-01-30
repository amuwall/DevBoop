import React, { useState, useMemo } from 'react';
import { 
  makeStyles, 
  shorthands, 
  Button, 
  Text, 
  Input,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  tokens
} from '@fluentui/react-components';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { 
  GridDots24Regular, 
  Search24Regular,
  Settings24Regular,
  Home24Regular,
  ChevronRight16Regular
} from '@fluentui/react-icons';
import { IPlugin } from '../types/plugin';

const useStyles = makeStyles({
  root: {
    width: '280px',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke1),
    flexShrink: 0,
  },
  header: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchContainer: {
    padding: '0 16px 16px 16px',
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '0 8px',
  },
  footer: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'flex-start',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
  },
  navItem: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    width: '100%',
    marginBottom: '4px',
  },
  categoryHeader: {
    fontSize: '13px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    padding: '8px 8px',
    textTransform: 'uppercase',
  }
});

export const Sidebar: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { plugins, openTab, setActiveTab } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Group plugins by category
  const groupedPlugins = useMemo(() => {
    const groups: Record<string, IPlugin[]> = {};
    
    plugins.forEach(plugin => {
      // Filter by search query
      if (searchQuery && !plugin.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      
      const category = plugin.category || 'uncategorized';
      // Hide system category from main list
      if (category === 'system') return;

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(plugin);
    });
    
    return groups;
  }, [plugins, searchQuery]);

  const handleOpenDashboard = () => {
    // We can implement this by closing all tabs or having a specific "dashboard" logic
    // For now, let's assume clearing active tab shows dashboard
    setActiveTab(''); 
  };

  const handleOpenSettings = () => {
    // We need a way to open settings. 
    // Since we don't have a settings plugin, we can't use openTab directly unless we hack it.
    // Let's assume Workspace handles 'settings' id.
    // Or we can register a dummy settings plugin?
    // Let's try to emit a custom event or use a specific ID that Workspace recognizes.
    // For now, I'll pass a special ID 'settings' to openTab, but openTab expects a pluginId that exists.
    // So I need to modify useAppStore or register a fake plugin.
    // Actually, let's just use a dedicated action for settings or handle it in Workspace via a special "tab".
    // I will trigger a specialized "openSettingsTab" logic here.
    // Since I can't easily change the store right now without breaking things, 
    // I'll assume I can just call openTab with a non-existent ID and handle it in Workspace? 
    // No, openTab checks if plugin exists.
    
    // Better approach: 
    // I'll emit a custom event or use a global state for "View Mode" if I could.
    // But sticking to the plan, I will add a `openSettings` method to store? 
    // No, I will just register a "Settings" plugin in the App.tsx! 
    // That is the cleanest way.
    openTab('settings-tool');
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <GridDots24Regular />
        <Text weight="bold" size={500}>DevBoop</Text>
      </div>

      <div className={styles.searchContainer}>
        <Input 
          contentBefore={<Search24Regular />}
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div className={styles.content}>
        <Button 
          appearance="subtle" 
          icon={<Home24Regular />} 
          className={styles.navItem}
          onClick={handleOpenDashboard}
        >
          {t('common.dashboard')}
        </Button>

        {Object.entries(groupedPlugins).map(([category, items]) => (
          <div key={category}>
            <div className={styles.categoryHeader}>
              {t(`categories.${category}`, category)}
            </div>
            {items.map(plugin => (
              <Button
                key={plugin.id}
                appearance="subtle"
                icon={plugin.icon || <ChevronRight16Regular />}
                className={styles.navItem}
                onClick={() => openTab(plugin.id)}
              >
                {plugin.name}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <Button 
          appearance="subtle" 
          icon={<Settings24Regular />}
          className={styles.navItem}
          onClick={handleOpenSettings}
        >
          {t('common.settings')}
        </Button>
      </div>
    </div>
  );
};
