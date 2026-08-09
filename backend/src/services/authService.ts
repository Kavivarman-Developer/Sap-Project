import crypto from 'crypto';
import { env } from '../config/env.js';

type TokenPayload = {
  role: 'admin';
  email: string;
  exp: number;
};

const toBase64Url = (value: string) =>
  Buffer.from(value).toString('base64url');

const sign = (payload: string) =>
  crypto.createHmac('sha256', env.authSecret).update(payload).digest('base64url');

export const loginAdmin = (email: string, password: string) => {
  if (email !== env.adminEmail || password !== env.adminPassword) {
    return null;
  }

  const payload: TokenPayload = {
    role: 'admin',
    email,
    exp: Date.now() + 1000 * 60 * 60 * 8,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

export const verifyAdminToken = (token: string) => {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()) as TokenPayload;
    if (payload.role !== 'admin' || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

