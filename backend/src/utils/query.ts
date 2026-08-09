import type { Request } from 'express';

export const getQueryValue = (value: Request['query'][string]) =>
  typeof value === 'string' ? value : '';

