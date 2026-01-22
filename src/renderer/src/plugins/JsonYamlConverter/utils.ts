
import yaml from 'js-yaml';

export interface ConvertResult {
  success: boolean;
  data: string;
  error?: string;
}

export const jsonToYaml = (jsonStr: string, indent: number = 2): ConvertResult => {
  try {
    if (!jsonStr.trim()) {
      return { success: true, data: '' };
    }
    const parsed = JSON.parse(jsonStr);
    const dumped = yaml.dump(parsed, { indent: indent });
    return { success: true, data: dumped };
  } catch (e: any) {
    return { success: false, data: '', error: `JSON Parse Error: ${e.message}` };
  }
};

export const yamlToJson = (yamlStr: string, indent: number = 2): ConvertResult => {
  try {
    if (!yamlStr.trim()) {
      return { success: true, data: '' };
    }
    const parsed = yaml.load(yamlStr);
    const stringified = JSON.stringify(parsed, null, indent);
    return { success: true, data: stringified };
  } catch (e: any) {
    return { success: false, data: '', error: `YAML Parse Error: ${e.message}` };
  }
};
