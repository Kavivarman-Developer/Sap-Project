import { Router } from 'express';
import { listCustomerLeads } from '../controllers/leadController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const leadRoutes = Router();

leadRoutes.get('/', requireAdmin, asyncHandler(listCustomerLeads));

