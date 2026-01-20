
import { describe, it, expect, beforeAll } from 'vitest';

describe('JwtTool Utils', () => {
  let generateToken: any;
  let verifyToken: any;
  let decodeTokenSafe: any;
  let jose: any;

  beforeAll(async () => {
    // Polyfill TextEncoder to ensure it produces Uint8Array instances 
    // that match the global Uint8Array in the test environment (jsdom)
    class CompatibleTextEncoder {
      encode(input: string): Uint8Array {
        if (typeof Buffer !== 'undefined') {
            return new Uint8Array(Buffer.from(input));
        }
        // Fallback if Buffer is not available (should be in vitest)
        const arr = new Uint8Array(input.length);
        for (let i = 0; i < input.length; i++) {
            arr[i] = input.charCodeAt(i);
        }
        return arr;
      }
    }
    // We overwrite the global TextEncoder
    global.TextEncoder = CompatibleTextEncoder as any;

    // Dynamically import modules to ensure they use the polyfill
    const utils = await import('./utils');
    generateToken = utils.generateToken;
    verifyToken = utils.verifyToken;
    decodeTokenSafe = utils.decodeTokenSafe;
    jose = await import('jose');
  });

  const payload = JSON.stringify({ sub: 'user123', name: 'Test User' });
  const secret = 'super-secret-key-1234567890';
  
  describe('HS256', () => {
    it('should generate and verify a valid token', async () => {
      const token = await generateToken({
        algorithm: 'HS256',
        secretOrPrivateKey: secret,
        payload: payload
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const result = await verifyToken({
        token,
        secretOrPublicKey: secret
      });

      expect(result.signatureValid).toBe(true);
      expect(result.payload.sub).toBe('user123');
      expect(result.header.alg).toBe('HS256');
    });

    it('should fail verification with wrong secret', async () => {
      const token = await generateToken({
        algorithm: 'HS256',
        secretOrPrivateKey: secret,
        payload: payload
      });

      const result = await verifyToken({
        token,
        secretOrPublicKey: 'wrong-secret'
      });

      expect(result.signatureValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle expiration', async () => {
      const key = new TextEncoder().encode(secret);
      const jwt = await new jose.SignJWT(JSON.parse(payload))
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('0s') // Expires immediately
        .sign(key);
      
      // Wait 10ms to ensure it expires
      await new Promise(r => setTimeout(r, 10));

      const result = await verifyToken({
        token: jwt,
        secretOrPublicKey: secret
      });

      expect(result.expired).toBe(true);
      expect(result.signatureValid).toBe(false);
    });
  });

  describe('RS256', () => {
    it('should generate and verify with RSA keys', async () => {
      // Generate keys for test
      const { privateKey, publicKey } = await jose.generateKeyPair('RS256', { extractable: true });
      const privatePem = await jose.exportPKCS8(privateKey);
      const publicPem = await jose.exportSPKI(publicKey);

      const token = await generateToken({
        algorithm: 'RS256',
        secretOrPrivateKey: privatePem,
        payload: payload
      });

      expect(token).toBeDefined();

      const result = await verifyToken({
        token,
        secretOrPublicKey: publicPem
      });

      expect(result.signatureValid).toBe(true);
      expect(result.payload.sub).toBe('user123');
    });
  });

  describe('decodeTokenSafe', () => {
    it('should decode token without verifying signature', async () => {
      const token = await generateToken({
        algorithm: 'HS256',
        secretOrPrivateKey: secret,
        payload: payload
      });

      const result = decodeTokenSafe(token);
      expect(result.payload.sub).toBe('user123');
      expect(result.signatureValid).toBe(false); 
    });

    it('should return nulls for invalid token', () => {
      const result = decodeTokenSafe('invalid.token.structure');
      expect(result.payload).toBeNull();
      expect(result.error).toBe('Invalid JWT format');
    });
  });
});
