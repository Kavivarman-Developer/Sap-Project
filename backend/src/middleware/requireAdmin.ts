import type { NextFunction, Request, Response } from 'express';
import { verifyAdminToken } from '../services/authService.js';

export const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
  const header = request.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  const payload = verifyAdminToken(token);

  if (!payload) {
    response.status(401).json({ message: 'Admin login required.' });
    return;
  }

  next();
};

