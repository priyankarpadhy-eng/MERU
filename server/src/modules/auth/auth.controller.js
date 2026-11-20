import { authService } from './auth.service.js';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const getCookieOptions = () => {
  const isProduction = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const { user, token } = await authService.signup(req.body);
    res.cookie('token', token, getCookieOptions());
    res.status(201).json({ user });
  }),

  login: asyncHandler(async (req, res) => {
    const { user, token } = await authService.login(req.body);
    res.cookie('token', token, getCookieOptions());
    res.status(200).json({ user });
  }),

  logout: asyncHandler(async (_req, res) => {
    res.clearCookie('token', getCookieOptions());
    res.status(204).send();
  }),

  getMe: asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ user });
  }),
};
