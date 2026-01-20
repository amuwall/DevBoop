
import React, { useState } from 'react';
import { 
  makeStyles, 
  Button, 
  Text,
  Textarea,
  Tab,
  TabList,
  tokens,
  Card,
  CardHeader,
  Field,
  Divider,
  SelectTabEvent,
  TabValue,
  Input,
  Dropdown,
  Option,
  SelectionEvents,
  OptionOnSelectData,
  Badge
} from '@fluentui/react-components';
import { 
  ArrowRight24Regular, 
  CheckmarkCircle24Regular,
  DismissCircle24Regular,
  CopyRegular, 
  KeyRegular,
  Warning24Regular
} from '@fluentui/react-icons';
import { IPlugin } from '../../types/plugin';
import { generateToken, verifyToken, decodeTokenSafe } from './utils';
import { Algorithm, DecodedResult } from './types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  card: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: 'min-content',
  },
  row: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1,
    flexBasis: '0',
    minWidth: '300px',
  },
  textarea: {
    fontFamily: 'monospace',
    minHeight: '120px',
  },
  jsonEditor: {
    fontFamily: 'monospace',
    minHeight: '200px',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    margin: '10px 0',
  },
  resultArea: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '10px',
    borderRadius: tokens.borderRadiusSmall,
    marginTop: '10px',
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
  },
  successText: {
    color: tokens.colorPaletteGreenForeground1,
  },
  warningText: {
    color: tokens.colorPaletteYellowForeground1,
  },
  badge: {
    marginLeft: '5px',
  }
});

const DEFAULT_PAYLOAD = JSON.stringify({
  sub: "1234567890",
  name: "John Doe",
  admin: true
}, null, 2);

const DEFAULT_HEADER = JSON.stringify({
  typ: "JWT"
}, null, 2);

const ALGORITHMS: Algorithm[] = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'];

const JwtComponent: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<TabValue>('generate');
  
  // Generate State
  const [genAlg, setGenAlg] = useState<Algorithm>('HS256');
  const [genSecret, setGenSecret] = useState('secret');
  const [genPayload, setGenPayload] = useState(DEFAULT_PAYLOAD);
  const [genHeader, setGenHeader] = useState(DEFAULT_HEADER); // Optional custom header
  const [genExpires, setGenExpires] = useState('1h');
  const [genToken, setGenToken] = useState('');
  const [genError, setGenError] = useState('');

  // Verify State
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [verifySecret, setVerifySecret] = useState('secret');
  const [verifyResult, setVerifyResult] = useState<DecodedResult | null>(null);

  const handleTabSelect = (_: SelectTabEvent, data: { value: TabValue }) => {
    setSelectedTab(data.value);
  };

  const handleGenerate = async () => {
    try {
      setGenError('');
      const token = await generateToken({
        algorithm: genAlg,
        secretOrPrivateKey: genSecret,
        payload: genPayload,
        headers: genHeader,
        expiresIn: genExpires
      });
      setGenToken(token);
    } catch (e: any) {
      setGenError(e.message);
    }
  };

  const handleVerify = async () => {
    if (!verifyTokenInput) return;
    const result = await verifyToken({
      token: verifyTokenInput,
      secretOrPublicKey: verifySecret
    });
    setVerifyResult(result);
  };

  const handleDecodeOnly = () => {
    if (!verifyTokenInput) return;
    const result = decodeTokenSafe(verifyTokenInput);
    setVerifyResult(result);
  };

  const handleAlgChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setGenAlg(data.optionValue as Algorithm);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader 
          header={<Text weight="bold" size={500}>JWT 工具箱</Text>}
          description={<Text>JSON Web Token 生成、解析与验证</Text>}
        />
        
        <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
          <Tab value="generate">生成 Token</Tab>
          <Tab value="verify">解析 / 验证</Tab>
        </TabList>

        <Divider />

        {selectedTab === 'generate' && (
          <div className={styles.column}>
            <div className={styles.row}>
              <div className={styles.column} style={{ flexGrow: 0, minWidth: '150px' }}>
                <Field label="算法">
                  <Dropdown 
                    value={genAlg} 
                    selectedOptions={[genAlg]}
                    onOptionSelect={handleAlgChange}
                  >
                    {ALGORITHMS.map(alg => (
                      <Option key={alg} value={alg}>{alg}</Option>
                    ))}
                  </Dropdown>
                </Field>
              </div>
              <div className={styles.column}>
                <Field label="过期时间 (例如: 1h, 2d, 10m)">
                  <Input 
                    value={genExpires} 
                    onChange={(e) => setGenExpires(e.target.value)} 
                    placeholder="1h" 
                  />
                </Field>
              </div>
            </div>

            <div className={styles.row}>
               <div className={styles.column}>
                  <Field label={genAlg.startsWith('HS') ? "密钥 (Secret)" : "私钥 (Private Key PEM)"}>
                    <Textarea 
                      className={styles.textarea}
                      value={genSecret}
                      onChange={(e) => setGenSecret(e.target.value)}
                      placeholder={genAlg.startsWith('HS') ? "Enter secret..." : "-----BEGIN PRIVATE KEY-----..."}
                    />
                  </Field>
               </div>
            </div>

            <div className={styles.row}>
              <div className={styles.column}>
                <Field label="Header (JSON)">
                  <Textarea 
                    className={styles.textarea}
                    style={{ minHeight: '80px' }}
                    value={genHeader}
                    onChange={(e) => setGenHeader(e.target.value)}
                  />
                </Field>
              </div>
              <div className={styles.column}>
                <Field label="Payload (JSON)">
                  <Textarea 
                    className={styles.jsonEditor}
                    value={genPayload}
                    onChange={(e) => setGenPayload(e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {genError && <Text className={styles.errorText}>{genError}</Text>}

            <div className={styles.controls}>
              <Button appearance="primary" onClick={handleGenerate}>生成 Token</Button>
            </div>

            {genToken && (
              <div className={styles.resultArea}>
                <Field label="生成的 Token">
                  <Textarea value={genToken} readOnly className={styles.textarea} />
                </Field>
                <div className={styles.controls}>
                  <Button icon={<CopyRegular />} onClick={() => copyToClipboard(genToken)}>复制</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'verify' && (
          <div className={styles.column}>
            <Field label="Token">
              <Textarea 
                className={styles.textarea}
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                placeholder="eyJhbGciOi..."
              />
            </Field>

            <Field label="密钥 / 公钥 (用于验证签名)">
               <Textarea 
                 className={styles.textarea}
                 style={{ minHeight: '80px' }}
                 value={verifySecret}
                 onChange={(e) => setVerifySecret(e.target.value)}
                 placeholder="Secret or Public Key PEM..."
               />
            </Field>

            <div className={styles.controls}>
              <Button onClick={handleDecodeOnly}>仅解析 (Decode)</Button>
              <Button appearance="primary" onClick={handleVerify}>验证 (Verify)</Button>
            </div>

            {verifyResult && (
              <div className={styles.resultArea}>
                <div className={styles.row} style={{ alignItems: 'center', marginBottom: '10px' }}>
                  <Text weight="bold">状态:</Text>
                  {verifyResult.signatureValid ? (
                     <Badge color="success" icon={<CheckmarkCircle24Regular />}>签名有效</Badge>
                  ) : (
                     <Badge color="danger" icon={<DismissCircle24Regular />}>签名无效</Badge>
                  )}
                  {verifyResult.expired && (
                     <Badge color="warning" icon={<Warning24Regular />}>已过期</Badge>
                  )}
                  {verifyResult.error && (
                    <Text className={styles.errorText}>({verifyResult.error})</Text>
                  )}
                </div>

                <div className={styles.row}>
                  <div className={styles.column}>
                    <Field label="Header">
                      <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
                        {JSON.stringify(verifyResult.header, null, 2)}
                      </pre>
                    </Field>
                  </div>
                  <div className={styles.column}>
                    <Field label="Payload">
                      <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
                        {JSON.stringify(verifyResult.payload, null, 2)}
                      </pre>
                    </Field>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export const JwtPlugin: IPlugin = {
  id: 'jwt-tool',
  name: 'JWT 工具',
  description: 'JWT 生成、解析与签名验证',
  icon: <KeyRegular />,
  component: JwtComponent,
  version: '1.0.0',
  author: 'DevBoop'
};
