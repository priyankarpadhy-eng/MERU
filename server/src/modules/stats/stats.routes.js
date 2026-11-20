import express from 'express';
import { statsController } from './stats.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

// Stats endpoints are protected
router.use(requireAuth);

router.get('/', statsController.getStats);

export default router;
