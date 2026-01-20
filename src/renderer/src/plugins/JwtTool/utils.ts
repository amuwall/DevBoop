
import { 
  SignJWT, 
  importPKCS8, 
  importSPKI, 
  jwtVerify, 
  decodeProtectedHeader, 
  decodeJwt, 
  type KeyLike 
} from 'jose';
import { GenerateOptions, VerifyOptions, DecodedResult, Algorithm } from './types';

const ENCODER = new TextEncoder();

const getSecretKey = (secret: string) => ENCODER.encode(secret);

const importPrivateKey = async (pem: string, alg: string) => {
  try {
    return await importPKCS8(pem, alg);
  } catch (e) {
    throw new Error('Invalid Private Key format');
  }
};

const importPublicKey = async (pem: string, alg: string) => {
  try {
    return await importSPKI(pem, alg);
  } catch (e) {
    throw new Error('Invalid Public Key format');
  }
};

export const generateToken = async (options: GenerateOptions): Promise<string> => {
  const { algorithm, secretOrPrivateKey, payload, expiresIn, headers } = options;
  
  let payloadObj: any;

  try {
    payloadObj = JSON.parse(payload);
  } catch (e) {
    throw new Error('Invalid Payload JSON');
  }

  let headerObj: any = {};
  if (headers) {
    try {
      headerObj = JSON.parse(headers);
    } catch (e) {
      throw new Error('Invalid Header JSON');
    }
  }

  let key: Uint8Array | KeyLike;

  if (algorithm.startsWith('HS')) {
    key = getSecretKey(secretOrPrivateKey);
  } else {
    key = await importPrivateKey(secretOrPrivateKey, algorithm);
  }

  const jwt = new SignJWT(payloadObj)
    .setProtectedHeader({ alg: algorithm, ...headerObj });

  if (expiresIn) {
    jwt.setExpirationTime(expiresIn);
  }

  jwt.setIssuedAt();

  return await jwt.sign(key);
};

export const verifyToken = async (options: VerifyOptions): Promise<DecodedResult> => {
  const { token, secretOrPublicKey } = options;
  
  // First decode without verification to get the header (to know the alg)
  // But jose.jwtVerify needs the key, and the key type depends on the alg.
  // So we first decode it unsafely to check the alg.
  let header: any;
  let payload: any;
  try {
    const decoded = decodeProtectedHeader(token);
    header = decoded;
    payload = decodeJwt(token);
  } catch (e) {
    return {
      header: null,
      payload: null,
      signatureValid: false,
      expired: false,
      error: 'Invalid JWT format'
    };
  }

  const alg = header.alg as Algorithm;
  if (!alg) {
     return {
      header,
      payload,
      signatureValid: false,
      expired: false,
      error: 'Missing algorithm in header'
    };
  }

  try {
    let key: Uint8Array | any;
    if (alg.startsWith('HS')) {
      key = getSecretKey(secretOrPublicKey);
    } else {
      key = await importPublicKey(secretOrPublicKey, alg);
    }

    await jwtVerify(token, key);

    return {
      header,
      payload,
      signatureValid: true,
      expired: false
    };
  } catch (e: any) {
    let expired = false;
    let errorMsg = e.message;

    if (e.code === 'ERR_JWT_EXPIRED') {
      expired = true;
      // Even if expired, signature might be valid, but jose throws.
      // We can consider signature valid if the only error is expiration?
      // Strict verification fails on expiration.
    }

    return {
      header,
      payload,
      signatureValid: false, // In strict verification, any error means invalid
      expired,
      error: errorMsg
    };
  }
};

export const decodeTokenSafe = (token: string): DecodedResult => {
  try {
    const header = decodeProtectedHeader(token);
    const payload = decodeJwt(token);
    return {
      header,
      payload,
      signatureValid: false, // Unknown
      expired: false // Unknown
    };
  } catch (e) {
    return {
      header: null,
      payload: null,
      signatureValid: false,
      expired: false,
      error: 'Invalid JWT format'
    };
  }
};
