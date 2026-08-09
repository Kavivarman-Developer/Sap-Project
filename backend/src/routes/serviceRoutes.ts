import { Router } from 'express';
import { listServices } from '../controllers/serviceController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const serviceRoutes = Router();

serviceRoutes.get('/', asyncHandler(listServices));

