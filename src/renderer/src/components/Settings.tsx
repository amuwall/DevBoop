import React from 'react';
import { 
  makeStyles, 
  tokens, 
  Text, 
  Dropdown, 
  Option,
  SelectionEvents,
  OptionOnSelectData,
  Label,
  Card
} from '@fluentui/react-components';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  }
});

export const Settings: React.FC = () => {
  const styles = useStyles();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useAppStore();

  const handleThemeChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setTheme(data.optionValue as 'light' | 'dark' | 'system');
  };

  return (
    <div className={styles.container}>
      <Text size={600} weight="bold">{t('common.settings')}</Text>

      <div className={styles.section}>
        <Text weight="semibold" size={400}>General</Text>
        
        <div className={styles.row}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Label weight="semibold">{t('common.theme')}</Label>
            <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
              Select your preferred appearance
            </Text>
          </div>
          <Dropdown
            value={t(`common.${theme}`)}
            selectedOptions={[theme]}
            onOptionSelect={handleThemeChange}
          >
            <Option value="light">{t('common.light')}</Option>
            <Option value="dark">{t('common.dark')}</Option>
            <Option value="system">{t('common.system')}</Option>
          </Dropdown>
        </div>
      </div>
      
      <div className={styles.section}>
        <Text weight="semibold" size={400}>About</Text>
        <Card>
          <div style={{ padding: '16px' }}>
             <Text>DevBoop v1.0.0</Text>
             <br/>
             <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
               A comprehensive developer toolbox.
             </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};
