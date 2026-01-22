
import { describe, it, expect } from 'vitest';
import { jsonToYaml, yamlToJson } from './utils';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { JsonYamlPlugin } from './index';

describe('JsonYamlConverter Utils', () => {
  const sampleJson = '{"key":"value","nested":{"array":[1,2,3]}}';
  const sampleYaml = `key: value
nested:
  array:
    - 1
    - 2
    - 3
`;

  it('should convert JSON to YAML correctly', () => {
    const result = jsonToYaml(sampleJson);
    expect(result.success).toBe(true);
    expect(result.data).toContain('key: value');
    expect(result.data).toContain('- 1');
  });

  it('should convert YAML to JSON correctly', () => {
    const result = yamlToJson(sampleYaml);
    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.data);
    expect(parsed.key).toBe('value');
    expect(parsed.nested.array).toHaveLength(3);
  });

  it('should handle invalid JSON gracefully', () => {
    const result = jsonToYaml('{invalid-json');
    expect(result.success).toBe(false);
    expect(result.error).toContain('JSON Parse Error');
  });

  it('should handle invalid YAML gracefully', () => {
    const result = yamlToJson('key: : value'); // Invalid YAML
    expect(result.success).toBe(false);
    expect(result.error).toContain('YAML Parse Error');
  });
});

describe('JsonYamlPlugin UI', () => {
    it('should have valid metadata', () => {
        expect(JsonYamlPlugin.id).toBe('json-yaml-converter');
        expect(JsonYamlPlugin.name).toBe('JSON/YAML 转换');
    });

    it('should render component without crashing', () => {
        const Component = JsonYamlPlugin.component;
        render(<Component />);
        expect(screen.getByText('JSON / YAML 转换器')).toBeDefined();
        // Check for conversion buttons
        expect(screen.getByText('JSON → YAML')).toBeDefined();
        expect(screen.getByText('JSON ← YAML')).toBeDefined();
    });
});
