import { leadsService } from './leads.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const leadsController = {
  createLead: asyncHandler(async (req, res) => {
    const lead = await leadsService.createLead(req.user.id, req.body);
    res.status(201).json({ lead });
  }),

  getLeads: asyncHandler(async (req, res) => {
    const result = await leadsService.getLeads(req.user.id, req.query);
    res.status(200).json(result);
  }),

  getLeadById: asyncHandler(async (req, res) => {
    const lead = await leadsService.getLeadById(req.user.id, req.params.id);
    res.status(200).json({ lead });
  }),

  updateLead: asyncHandler(async (req, res) => {
    const lead = await leadsService.updateLead(req.user.id, req.params.id, req.body);
    res.status(200).json({ lead });
  }),

  deleteLead: asyncHandler(async (req, res) => {
    await leadsService.deleteLead(req.user.id, req.params.id);
    res.status(204).send();
  }),
};
