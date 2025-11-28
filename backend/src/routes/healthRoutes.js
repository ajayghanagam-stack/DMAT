import express from 'express';
import { healthCheck, dbCheck } from '../controllers/healthController.js';

const router = express.Router();

// Health check route
router.get('/health', healthCheck);

// Database check route
router.get('/db-check', dbCheck);

export default router;
