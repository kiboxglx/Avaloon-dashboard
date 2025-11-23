import * as crypto from 'crypto';
import { Buffer } from 'buffer';

// Ensure this environment variable is set in Firebase Functions
// firebase functions:config:set avaloon.secret="YOUR_32_CHAR_SECRET"
// Or simplified for this file to fallback to a hardcoded dev key if missing (WARN: NOT FOR PROD)
const SECRET_KEY_STRING = process.env.AVALOON_TOKEN_SECRET || "mvp_dev_secret_key_must_be_32_b";

// Derive a 32-byte key from the string
const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.scryptSync(SECRET_KEY_STRING, 'salt', 32);

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decrypt = (text: string): string => {
  const parts = text.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted format');
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};