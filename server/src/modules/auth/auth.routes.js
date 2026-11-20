import express from 'express';
import { authController } from './auth.controller.js';
import { signupSchema, loginSchema } from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimit.js';

const router = express.Router();

router.post('/signup', authRateLimiter, validate(signupSchema), authController.signup);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);

export default router;
