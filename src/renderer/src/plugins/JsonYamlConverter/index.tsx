
import React, { useState } from 'react';
import { 
  makeStyles, 
  Button, 
  Text,
  Textarea,
  tokens,
  Card,
  CardHeader,
  Field,
  Divider,
} from '@fluentui/react-components';
import { 
  ArrowRight24Regular, 
  ArrowLeft24Regular, 
  CopyRegular, 
  DeleteRegular,
  DocumentDataRegular
} from '@fluentui/react-icons';
import { IPlugin } from '../../types/plugin';
import { jsonToYaml, yamlToJson } from './utils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box',
    height: '100%',
  },
  card: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexGrow: 1,
  },
  row: {
    display: 'flex',
    gap: '20px',
    alignItems: 'stretch',
    flexGrow: 1,
    minHeight: '400px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1,
    flexBasis: '0',
  },
  textarea: {
    flexGrow: 1,
    fontFamily: 'monospace',
    resize: 'none',
    minHeight: '300px',
    '& textarea': {
       height: '100% !important',
       maxHeight: 'none !important'
    }
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    justifyContent: 'center',
    padding: '0 10px',
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    marginTop: '5px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    minHeight: '20px', // Reserve space
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  }
});

const JsonYamlComponent: React.FC = () => {
  const styles = useStyles();
  
  const [jsonValue, setJsonValue] = useState('');
  const [yamlValue, setYamlValue] = useState('');
  const [error, setError] = useState('');

  const handleJsonToYaml = () => {
    if (!jsonValue.trim()) {
      setYamlValue('');
      setError('');
      return;
    }
    const result = jsonToYaml(jsonValue);
    if (result.success) {
      setYamlValue(result.data);
      setError('');
    } else {
      setError(result.error || 'JSON Parse Error');
    }
  };

  const handleYamlToJson = () => {
    if (!yamlValue.trim()) {
      setJsonValue('');
      setError('');
      return;
    }
    const result = yamlToJson(yamlValue);
    if (result.success) {
      setJsonValue(result.data);
      setError('');
    } else {
      setError(result.error || 'YAML Parse Error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader 
          header={<Text weight="bold" size={500}>JSON / YAML 转换器</Text>}
          description={<Text>JSON 与 YAML 格式互转工具</Text>}
        />
        
        <Divider />
        
        {error && (
            <div style={{ backgroundColor: tokens.colorPaletteRedBackground2, padding: '10px', borderRadius: '4px' }}>
                <Text className={styles.errorText}>{error}</Text>
            </div>
        )}

        <div className={styles.row}>
          {/* JSON Column */}
          <div className={styles.column}>
            <Field label="JSON">
              <Textarea 
                className={styles.textarea}
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                placeholder='{"key": "value"}'
              />
            </Field>
            <div className={styles.toolbar}>
                <Button icon={<DeleteRegular />} onClick={() => { setJsonValue(''); setError(''); }} disabled={!jsonValue}>
                    清空
                </Button>
                <Button icon={<CopyRegular />} onClick={() => copyToClipboard(jsonValue)} disabled={!jsonValue}>
                    复制
                </Button>
            </div>
          </div>

          {/* Conversion Controls */}
          <div className={styles.controls}>
             <Button 
               icon={<ArrowRight24Regular />} 
               appearance="primary"
               onClick={handleJsonToYaml}
               title="JSON 转 YAML"
               size="large"
             >
                JSON &rarr; YAML
             </Button>
             
             <Button 
               icon={<ArrowLeft24Regular />} 
               appearance="primary"
               onClick={handleYamlToJson}
               title="YAML 转 JSON"
               size="large"
             >
                JSON &larr; YAML
             </Button>
          </div>

          {/* YAML Column */}
          <div className={styles.column}>
            <Field label="YAML">
              <Textarea 
                className={styles.textarea}
                value={yamlValue}
                onChange={(e) => setYamlValue(e.target.value)}
                placeholder="key: value"
              />
            </Field>
            <div className={styles.toolbar}>
                <Button icon={<DeleteRegular />} onClick={() => { setYamlValue(''); setError(''); }} disabled={!yamlValue}>
                    清空
                </Button>
                <Button icon={<CopyRegular />} onClick={() => copyToClipboard(yamlValue)} disabled={!yamlValue}>
                    复制
                </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const JsonYamlPlugin: IPlugin = {
  id: 'json-yaml-converter',
  name: 'JSON/YAML 转换',
  description: 'JSON 与 YAML 格式互转工具',
  category: 'converters',
  tags: ['json', 'yaml', 'format', 'convert'],
  icon: <DocumentDataRegular />,
  component: JsonYamlComponent,
  version: '1.0.0',
  author: 'DevBoop'
};
