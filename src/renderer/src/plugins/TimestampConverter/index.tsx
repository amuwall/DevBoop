import React, { useState, useEffect } from 'react';
import { 
  makeStyles, 
  Input, 
  Button, 
  Text,
  RadioGroup,
  Radio,
  Field,
  tokens,
  Card,
  CardHeader,
  CardPreview
} from '@fluentui/react-components';
import { Clock24Regular, CopyRegular, ArrowRepeatAllRegular } from '@fluentui/react-icons';
import { IPlugin } from '../../types/plugin';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  row: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  card: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  result: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

const TimestampComponent: React.FC = () => {
  const styles = useStyles();
  const [timestamp, setTimestamp] = useState<string>('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateStr, setDateStr] = useState<string>('');
  const [localDate, setLocalDate] = useState<string>('');
  const [utcDate, setUtcDate] = useState<string>('');

  // Auto-update current time on mount
  useEffect(() => {
    handleNow();
  }, []);

  const handleNow = () => {
    const now = Date.now();
    const ts = unit === 'seconds' ? Math.floor(now / 1000) : now;
    setTimestamp(ts.toString());
    convert(ts.toString(), unit);
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTimestamp(val);
    convert(val, unit);
  };

  const handleUnitChange = (_: any, data: { value: string }) => {
    const newUnit = data.value as 'seconds' | 'milliseconds';
    setUnit(newUnit);
    // Adjust current timestamp value
    if (timestamp) {
      let ts = parseInt(timestamp);
      if (!isNaN(ts)) {
        if (newUnit === 'milliseconds' && unit === 'seconds') {
          ts *= 1000;
        } else if (newUnit === 'seconds' && unit === 'milliseconds') {
          ts = Math.floor(ts / 1000);
        }
        setTimestamp(ts.toString());
        convert(ts.toString(), newUnit);
      }
    }
  };

  const convert = (tsStr: string, currentUnit: 'seconds' | 'milliseconds') => {
    const ts = parseInt(tsStr);
    if (isNaN(ts)) {
      setLocalDate('Invalid Date');
      setUtcDate('Invalid Date');
      return;
    }

    const date = new Date(currentUnit === 'seconds' ? ts * 1000 : ts);
    setLocalDate(date.toLocaleString());
    setUtcDate(date.toUTCString());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader 
          header={<Text weight="bold" size={500}>Unix Timestamp Converter</Text>}
          description={<Text>Convert between Unix timestamps and human-readable dates</Text>}
        />
        
        <div className={styles.row}>
          <Field label="Timestamp" style={{ flexGrow: 1 }}>
            <Input 
              value={timestamp} 
              onChange={handleTimestampChange} 
              type="number"
              placeholder="Enter timestamp..."
            />
          </Field>
          <Button icon={<Clock24Regular />} onClick={handleNow}>Now</Button>
        </div>

        <div className={styles.row}>
           <Field label="Unit">
            <RadioGroup layout="horizontal" value={unit} onChange={handleUnitChange}>
              <Radio value="seconds" label="Seconds" />
              <Radio value="milliseconds" label="Milliseconds" />
            </RadioGroup>
          </Field>
        </div>

        <div className={styles.result}>
          <div>
            <Text weight="semibold" style={{ display: 'block', marginBottom: '4px' }}>Local Time:</Text>
            <Text font="monospace">{localDate}</Text>
          </div>
          <Button 
            appearance="transparent" 
            icon={<CopyRegular />} 
            onClick={() => copyToClipboard(localDate)}
          />
        </div>

        <div className={styles.result}>
          <div>
            <Text weight="semibold" style={{ display: 'block', marginBottom: '4px' }}>UTC Time:</Text>
            <Text font="monospace">{utcDate}</Text>
          </div>
          <Button 
            appearance="transparent" 
            icon={<CopyRegular />} 
            onClick={() => copyToClipboard(utcDate)}
          />
        </div>
      </Card>
    </div>
  );
};

export const TimestampPlugin: IPlugin = {
  id: 'timestamp-converter',
  name: 'Timestamp Converter',
  description: 'Convert between Unix timestamps and readable dates',
  icon: <Clock24Regular />,
  component: TimestampComponent,
  version: '1.0.0',
  author: 'DevBoop'
};
