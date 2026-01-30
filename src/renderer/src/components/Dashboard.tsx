import React from 'react';
import { 
  makeStyles, 
  tokens, 
  Text, 
  Card, 
  CardHeader, 
  Button,
  Input
} from '@fluentui/react-components';
import { 
  Search24Regular, 
  Star24Filled, 
  Star24Regular,
  Clock24Regular
} from '@fluentui/react-icons';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { IPlugin } from '../types/plugin';

const useStyles = makeStyles({
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: '100%',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  searchBar: {
    maxWidth: '600px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  cardHeader: {
    marginBottom: '8px',
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
    height: '40px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  actions: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'flex-end',
  }
});

export const Dashboard: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { 
    plugins, 
    openTab, 
    recentPluginIds, 
    favoritePluginIds, 
    toggleFavorite 
  } = useAppStore();

  const recentPlugins = recentPluginIds
    .map(id => plugins.find(p => p.id === id))
    .filter((p): p is IPlugin => !!p && p.category !== 'system');

  const favoritePlugins = favoritePluginIds
    .map(id => plugins.find(p => p.id === id))
    .filter((p): p is IPlugin => !!p && p.category !== 'system');

  const allPlugins = plugins.filter(p => p.category !== 'system');

  const handleCardClick = (pluginId: string) => {
    openTab(pluginId);
  };

  const renderPluginCard = (plugin: IPlugin) => (
    <Card 
      key={plugin.id} 
      className={styles.card} 
      onClick={() => handleCardClick(plugin.id)}
    >
      <CardHeader
        image={plugin.icon}
        header={<Text weight="semibold">{plugin.name}</Text>}
        action={
          <Button
            appearance="transparent"
            icon={favoritePluginIds.includes(plugin.id) ? <Star24Filled /> : <Star24Regular />}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(plugin.id);
            }}
          />
        }
      />
      <Text className={styles.description}>{plugin.description}</Text>
    </Card>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text size={600} weight="bold">DevBoop</Text>
      </div>

      {recentPlugins.length > 0 && (
        <div className={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock24Regular />
            <Text weight="semibold" size={400}>{t('common.recent_tools')}</Text>
          </div>
          <div className={styles.grid}>
            {recentPlugins.map(renderPluginCard)}
          </div>
        </div>
      )}

      {favoritePlugins.length > 0 && (
        <div className={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star24Filled />
            <Text weight="semibold" size={400}>{t('common.favorites')}</Text>
          </div>
          <div className={styles.grid}>
            {favoritePlugins.map(renderPluginCard)}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <Text weight="semibold" size={400}>{t('common.all_tools')}</Text>
        <div className={styles.grid}>
          {allPlugins.map(renderPluginCard)}
        </div>
      </div>
    </div>
  );
};
