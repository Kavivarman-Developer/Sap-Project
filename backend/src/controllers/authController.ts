import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginAdmin } from '../services/authService.js';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const login = (request: Request, response: Response) => {
  const result = loginSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({ message: 'Enter admin email and password.' });
    return;
  }

  const token = loginAdmin(result.data.email, result.data.password);

  if (!token) {
    response.status(401).json({ message: 'Invalid admin credentials.' });
    return;
  }

  response.status(200).json({ token, admin: { email: result.data.email } });
};
