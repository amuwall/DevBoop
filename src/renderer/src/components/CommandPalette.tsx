import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20vh',
  },
  container: {
    width: '640px',
    maxWidth: '90%',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow28,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    maxHeight: '400px',
  },
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    '::placeholder': {
      color: tokens.colorNeutralForeground4,
    }
  },
  list: {
    overflow: 'auto',
    padding: '8px',
    maxHeight: '300px',
  },
  group: {
    marginBottom: '8px',
  },
  groupHeading: {
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground4,
    textTransform: 'uppercase',
  },
  item: {
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
    '&[data-selected="true"]': {
      backgroundColor: tokens.colorBrandBackground2,
      color: tokens.colorNeutralForeground1,
    },
    '&:active': {
      backgroundColor: tokens.colorBrandBackground2Pressed,
    }
  },
  shortcut: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground4,
  },
  empty: {
    padding: '16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground4,
  }
});

export const CommandPalette: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { 
    plugins, 
    isCommandPaletteOpen, 
    toggleCommandPalette, 
    openTab 
  } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        toggleCommandPalette(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, toggleCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => toggleCommandPalette(false)}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <Command label="Command Menu">
          <Command.Input 
            autoFocus
            placeholder={t('common.search_placeholder')}
            className={styles.input}
          />
          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>{t('common.no_results')}</Command.Empty>

            <Command.Group heading={t('common.all_tools')} className={styles.group}>
              <div className={styles.groupHeading}>{t('common.all_tools')}</div>
              {plugins.filter(p => p.category !== 'system').map((plugin) => (
                <Command.Item
                  key={plugin.id}
                  className={styles.item}
                  onSelect={() => {
                    openTab(plugin.id);
                    toggleCommandPalette(false);
                  }}
                >
                  <span>{plugin.name}</span>
                  {/* We can add icons here later */}
                </Command.Item>
              ))}
            </Command.Group>

            {/* We can add System Commands here later like "Toggle Theme" */}
            <Command.Group heading="System" className={styles.group}>
              <div className={styles.groupHeading}>System</div>
               {/* Placeholder for system commands */}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
