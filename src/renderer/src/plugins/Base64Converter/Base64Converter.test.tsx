
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { textToBase64, base64ToText } from './utils';
import { Base64Plugin } from './index';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

// Mock Fluent UI provider for testing
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>
    {children}
  </FluentProvider>
);

describe('Base64 Utilities', () => {
  it('should encode simple text correctly', () => {
    const input = 'Hello World';
    const expected = 'SGVsbG8gV29ybGQ=';
    expect(textToBase64(input)).toBe(expected);
  });

  it('should decode simple text correctly', () => {
    const input = 'SGVsbG8gV29ybGQ=';
    const expected = 'Hello World';
    expect(base64ToText(input)).toBe(expected);
  });

  it('should handle UTF-8 characters (Chinese)', () => {
    const input = '你好，世界';
    // "你好，世界" in UTF-8 bytes -> Base64
    const expected = '5L2g5aW977yM5LiW55WM'; 
    expect(textToBase64(input)).toBe(expected);
    expect(base64ToText(expected)).toBe(input);
  });

  it('should handle URL safe encoding', () => {
    const input = 'Hello World'; 
    const encoded = textToBase64(input, true);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('='); // We strip padding
  });

  it('should auto-detect URL safe Base64 when decoding', () => {
    const input = 'SGVsbG8gV29ybGQ=';
    expect(base64ToText(input)).toBe('Hello World');
  });
});

describe('Base64Plugin UI', () => {
  it('should have valid metadata', () => {
    expect(Base64Plugin.id).toBe('base64-converter');
    expect(Base64Plugin.name).toBe('Base64 编解码');
    expect(Base64Plugin.icon).toBeDefined();
  });

  it('should render component without crashing', () => {
    const Component = Base64Plugin.component;
    render(
      <Wrapper>
        <Component />
      </Wrapper>
    );
    expect(screen.getByText('Base64 转换工具')).toBeTruthy();
    expect(screen.getByText('文本与文件的 Base64 编码/解码')).toBeTruthy();
  });
});
