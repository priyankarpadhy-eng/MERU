import express from 'express';
import { leadsController } from './leads.controller.js';
import {
  createLeadSchema,
  updateLeadSchema,
  getLeadsQuerySchema,
  leadIdParamSchema,
} from './leads.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

// All leads routes require authentication
router.use(requireAuth);

router.post('/', validate(createLeadSchema), leadsController.createLead);
router.get('/', validate(getLeadsQuerySchema), leadsController.getLeads);
router.get('/:id', validate(leadIdParamSchema), leadsController.getLeadById);
router.patch('/:id', validate(updateLeadSchema), leadsController.updateLead);
router.delete('/:id', validate(leadIdParamSchema), leadsController.deleteLead);

export default router;
