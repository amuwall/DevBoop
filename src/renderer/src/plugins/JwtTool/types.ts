
export type Algorithm = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';

export interface GenerateOptions {
  algorithm: Algorithm;
  secretOrPrivateKey: string;
  payload: string; // JSON string
  expiresIn?: string; // e.g. "1h", "2d"
  headers?: string; // JSON string
}

export interface VerifyOptions {
  token: string;
  secretOrPublicKey: string;
}

export interface DecodedResult {
  header: any;
  payload: any;
  signatureValid: boolean;
  expired: boolean;
  error?: string;
}
