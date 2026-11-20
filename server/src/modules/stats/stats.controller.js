import { statsService } from './stats.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const statsController = {
  getStats: asyncHandler(async (req, res) => {
    const stats = await statsService.getStats(req.user.id);
    res.status(200).json(stats);
  }),
};
