
import React, { useState, useRef, useEffect } from 'react';
import { 
  makeStyles, 
  Button, 
  Text,
  Textarea,
  Checkbox,
  Tab,
  TabList,
  tokens,
  Card,
  CardHeader,
  Field,
  Divider,
  SelectTabEvent,
  TabValue,
  Image
} from '@fluentui/react-components';
import { 
  ArrowRight24Regular, 
  ArrowLeft24Regular, 
  CopyRegular, 
  DeleteRegular,
  DocumentArrowRightRegular,
  ArrowDownloadRegular
} from '@fluentui/react-icons';
import { IPlugin } from '../../types/plugin';
import { textToBase64, base64ToText, fileToBase64, base64ToBlob, detectMimeTypeFromBase64 } from './utils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    // padding: '20px', // Removed padding as Workspace already has padding
    // height: '100%', // Removed fixed height to allow scrolling by parent
    boxSizing: 'border-box',
    // overflowY: 'auto', // Removed to use parent scrolling
  },
  card: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    // Remove flexGrow: 1 to prevent card from forcing full height and blocking scroll
    // flexGrow: 1, 
    minHeight: 'min-content', // Ensure card takes at least its content height
  },
  row: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1,
  },
  textarea: {
    minHeight: '150px',
    fontFamily: 'monospace',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    margin: '10px 0',
  },
  fileArea: {
    border: `2px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
  },
  previewContainer: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
  }
});

const Base64Component: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<TabValue>('text');
  
  // Text Mode State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState('');

  // File Mode State
  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabSelect = (_: SelectTabEvent, data: { value: TabValue }) => {
    setSelectedTab(data.value);
    setError('');
  };

  const handleTextEncode = () => {
    try {
      setError('');
      const result = textToBase64(inputText, urlSafe);
      setOutputText(result);
    } catch (e) {
      setError('Encoding failed');
    }
  };

  const handleTextDecode = () => {
    try {
      setError('');
      const result = base64ToText(outputText);
      setInputText(result);
    } catch (e) {
      setError('Invalid Base64 input');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setFileName(file.name);
        const b64 = await fileToBase64(file);
        setFileBase64(b64);
        
        // Handle preview for file input
        // Always try to detect from content first as it's more reliable than file.type
        // And fallback to file.type only if detection fails but browser claims it's an image
        let mime = detectMimeTypeFromBase64(b64);
        
        if (!mime && file.type.startsWith('image/')) {
           mime = file.type;
        }

        if (mime) {
           setPreviewUrl(`data:${mime};base64,${b64}`);
        } else {
           setPreviewUrl(null);
        }
      } catch (e) {
        setError('File reading failed');
        setPreviewUrl(null);
      }
    }
  };
  
  // Effect to update preview when fileBase64 changes (for manual input case)
  // But we need to distinguish if it came from file input (we already have previewUrl) or manual paste
  useEffect(() => {
    // If fileBase64 is empty, clear preview
    if (!fileBase64) {
      setPreviewUrl(null);
      return;
    }

    // If we already have a preview URL from file input (blob:...), keep it?
    // Actually, if user modifies base64, we should update preview.
    // But modifying a huge base64 string is rare.
    // Let's rely on detecting mime type from base64 if no previewUrl exists OR if we want to be reactive.
    
    // Simple logic: Always try to detect from Base64 if it's an image
    const mime = detectMimeTypeFromBase64(fileBase64);
    if (mime) {
      // Construct data URI
      setPreviewUrl(`data:${mime};base64,${fileBase64}`);
    } else {
      // Only clear if it's not a blob url (which means it came from file input)
      // But wait, if user pasted a new base64, the old blob url is invalid for this content.
      // So we should clear it if mime detection fails.
      // However, detectMimeType might not cover all types.
      // Let's trust the detection for now.
      
      // If the current previewUrl is a blob url and the content hasn't changed... wait, this effect runs on change.
      // If it's a file upload, handleFileChange sets previewUrl (blob).
      // Then this effect runs. detectMimeType should also work for the base64 generated from that file.
      // So it's safe to overwrite the blob url with data url?
      // Data URL for large images is heavy. Blob URL is better.
      
      // Let's refine:
      // We only run detection if previewUrl is null OR if we want to support paste.
      // If handleFileChange set it, we might want to keep it.
      // But we can't easily know if fileBase64 changed due to file input or user typing.
      // Actually we can check if fileBase64 matches what we expect from the file... too complex.
      
      // Improved logic:
      // We don't use useEffect for this. We use specific handlers.
      // 1. handleFileChange: sets previewUrl (blob)
      // 2. handleBase64InputChange: detects mime and sets previewUrl (data uri)
    }
  }, []); // Don't use effect, use event handlers

  const handleBase64InputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFileBase64(val);
    
    // Try detect image
    if (!val) {
      setPreviewUrl(null);
      return;
    }
    
    const mime = detectMimeTypeFromBase64(val);
    if (mime) {
      setPreviewUrl(`data:${mime};base64,${val}`);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDownload = () => {
    try {
      if (!fileBase64) return;
      const blob = base64ToBlob(fileBase64);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download.bin';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError('Download failed: Invalid Base64 data');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader 
          header={<Text weight="bold" size={500}>Base64 转换工具</Text>}
          description={<Text>文本与文件的 Base64 编码/解码</Text>}
        />
        
        <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
          <Tab value="text">文本处理</Tab>
          <Tab value="file">文件处理</Tab>
        </TabList>

        <Divider />

        {selectedTab === 'text' && (
          <div className={styles.column}>
            <div className={styles.row}>
              <Checkbox 
                checked={urlSafe} 
                onChange={(_, data) => setUrlSafe(!!data.checked)}
                label="URL 安全模式 (适用于编码)" 
              />
            </div>

            <div className={styles.row} style={{ alignItems: 'stretch' }}>
              <div className={styles.column}>
                <Field label="原文内容">
                  <Textarea 
                    className={styles.textarea}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="在此输入需要编码的文本..."
                  />
                </Field>
              </div>
              
              <div className={styles.column}>
                <Field label="编码内容">
                  <Textarea 
                    className={styles.textarea}
                    value={outputText}
                    onChange={(e) => setOutputText(e.target.value)}
                    placeholder="在此输入需要解码的 Base64 字符串..."
                  />
                </Field>
              </div>
            </div>

            {error && <Text className={styles.errorText}>{error}</Text>}

            <div className={styles.controls}>
              <Button icon={<ArrowRight24Regular />} appearance="primary" onClick={handleTextEncode}>
                编码
              </Button>
              <Button icon={<ArrowLeft24Regular />} onClick={handleTextDecode}>
                解码
              </Button>
              <Button icon={<CopyRegular />} onClick={() => handleCopy(outputText)} disabled={!outputText}>
                复制结果
              </Button>
              <Button icon={<DeleteRegular />} onClick={handleClear}>
                清空
              </Button>
            </div>
          </div>
        )}

        {selectedTab === 'file' && (
          <div className={styles.column}>
            <div className={styles.row}>
              <div className={styles.column}>
                 <Field label="文件转 Base64">
                   <div 
                     className={styles.fileArea}
                     onClick={() => fileInputRef.current?.click()}
                   >
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       style={{ display: 'none' }} 
                       onChange={handleFileChange}
                     />
                     <Text>{fileName || '点击选择文件'}</Text>
                   </div>
                 </Field>
                 <Button 
                   style={{ marginTop: '10px' }}
                   icon={<CopyRegular />} 
                   onClick={() => handleCopy(fileBase64)}
                   disabled={!fileBase64}
                 >
                   复制 Base64
                 </Button>
              </div>
              
              <Divider vertical style={{ height: 'auto' }} />

              <div className={styles.column}>
                <Field label="Base64 转文件">
                  <Textarea 
                    className={styles.textarea}
                    value={fileBase64}
                    onChange={handleBase64InputChange}
                    placeholder="在此粘贴 Base64 字符串..."
                  />
                </Field>
                <div className={styles.row}>
                  <Field label="文件名 (可选)">
                     <input 
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="example.png"
                     />
                  </Field>
                </div>
                
                {previewUrl && (
                  <div className={styles.previewContainer}>
                    <Text weight="semibold">图片预览</Text>
                    <Image src={previewUrl} className={styles.previewImage} alt="Preview" />
                  </div>
                )}

                {error && <Text className={styles.errorText}>{error}</Text>}
                <Button 
                  appearance="primary" 
                  icon={<ArrowDownloadRegular />}
                  onClick={handleDownload}
                  disabled={!fileBase64}
                >
                  下载文件
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export const Base64Plugin: IPlugin = {
  id: 'base64-converter',
  name: 'Base64 编解码',
  description: '文本与文件的 Base64 转换工具',
  icon: <DocumentArrowRightRegular />,
  component: Base64Component,
  version: '1.0.0',
  author: 'DevBoop'
};
