
export const textToBase64 = (text: string, urlSafe: boolean = false): string => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let binary = '';
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i]);
    }
    let base64 = window.btoa(binary);
    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
      // Remove padding for URL safe is common but strictly speaking URL-safe Base64 usually omits padding
      base64 = base64.replace(/=+$/, '');
    }
    return base64;
  } catch (e) {
    console.error('Encoding error:', e);
    throw new Error('Encoding failed');
  }
};

export const base64ToText = (base64: string): string => {
  try {
    let standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (standardBase64.length % 4) {
      standardBase64 += '=';
    }

    const binary = window.atob(standardBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (e) {
    console.error('Decoding error:', e);
    throw new Error('Invalid Base64 input');
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // remove data:.*;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const base64ToBlob = (base64: string, mimeType: string = 'application/octet-stream'): Blob => {
  let standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (standardBase64.length % 4) {
    standardBase64 += '=';
  }

  const binary = window.atob(standardBase64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
};

export const detectMimeTypeFromBase64 = (base64: string): string | null => {
  try {
    // Just decode the first few bytes to check headers
    // Don't decode whole string for performance
    // Need enough bytes for headers (at least 12-16 bytes decoded)
    // Base64 4 chars -> 3 bytes. 30 chars -> ~22 bytes. Enough.
    const header = base64.slice(0, 30).replace(/-/g, '+').replace(/_/g, '/');
    
    // Check if header is valid base64 length (multiple of 4 for atob?)
    // atob ignores whitespace but requires padding if length % 4 != 0 usually, 
    // or just valid chars. slice might cut in middle.
    // Let's pad it to be safe.
    let paddedHeader = header;
    while (paddedHeader.length % 4) {
      paddedHeader += '=';
    }
    
    const binary = window.atob(paddedHeader);
    
    // Check for common signatures
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (binary.charCodeAt(0) === 0x89 && 
        binary.charCodeAt(1) === 0x50 && 
        binary.charCodeAt(2) === 0x4E && 
        binary.charCodeAt(3) === 0x47) {
      return 'image/png';
    }
    
    // JPEG: FF D8 FF
    if (binary.charCodeAt(0) === 0xFF && 
        binary.charCodeAt(1) === 0xD8 && 
        binary.charCodeAt(2) === 0xFF) {
      return 'image/jpeg';
    }
    
    // GIF: 47 49 46 38 (GIF8)
    if (binary.charCodeAt(0) === 0x47 && 
        binary.charCodeAt(1) === 0x49 && 
        binary.charCodeAt(2) === 0x46 && 
        binary.charCodeAt(3) === 0x38) {
      return 'image/gif';
    }
    
    // WEBP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
    // Offset 0-3: RIFF, Offset 8-11: WEBP
    if (binary.charCodeAt(0) === 0x52 && 
        binary.charCodeAt(1) === 0x49 && 
        binary.charCodeAt(2) === 0x46 && 
        binary.charCodeAt(3) === 0x46 &&
        binary.charCodeAt(8) === 0x57 &&
        binary.charCodeAt(9) === 0x45 &&
        binary.charCodeAt(10) === 0x42 &&
        binary.charCodeAt(11) === 0x50) {
      return 'image/webp';
    }

    // BMP: 42 4D
    if (binary.charCodeAt(0) === 0x42 && binary.charCodeAt(1) === 0x4D) {
      return 'image/bmp';
    }
    
    // ICO: 00 00 01 00
    if (binary.charCodeAt(0) === 0x00 && 
        binary.charCodeAt(1) === 0x00 && 
        binary.charCodeAt(2) === 0x01 && 
        binary.charCodeAt(3) === 0x00) {
      return 'image/x-icon';
    }

    return null;
  } catch (e) {
    return null;
  }
};
