import type { Request, Response } from 'express';
import { listLeads } from '../services/leadService.js';

const getPositiveNumber = (value: unknown, fallback: number) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export const listCustomerLeads = async (request: Request, response: Response) => {
  const page = getPositiveNumber(request.query.page, 1);
  const pageSize = getPositiveNumber(request.query.pageSize, 10);
  const result = await listLeads(page, pageSize);
  response.status(200).json(result);
};

