import { Router } from 'express';
import { listSlots } from '../controllers/slotController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const slotRoutes = Router();

slotRoutes.get('/', asyncHandler(listSlots));

