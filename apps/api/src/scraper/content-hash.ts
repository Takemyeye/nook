import { createHash } from 'node:crypto';

export const contentHash = (text: string): string => {
  const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  return createHash('sha256').update(normalized).digest('hex');
};
