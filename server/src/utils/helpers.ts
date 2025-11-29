import { nanoid } from 'nanoid';

export const generateShortCode = (): string => {
  return nanoid(7);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getClientIp = (req: any): string => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
};
