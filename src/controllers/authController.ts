import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { successResponse } from '../utils/helpers';

const authService = new AuthService();

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user, tokens } = await authService.register(req.body);
    successResponse(
      res,
      { user: user.toJSON(), tokens },
      'Registration successful',
      201,
    );
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user, tokens } = await authService.login(req.body);
    successResponse(res, { user: user.toJSON(), tokens }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tokens = await authService.refreshTokens(req.body.refreshToken);
    successResponse(res, tokens, 'Tokens refreshed');
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user as { id: string };
    await authService.logout(user.id);
    successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}

export function me(req: Request, res: Response): void {
  const user = req.user as { toJSON: () => unknown };
  successResponse(res, user.toJSON(), 'Profile retrieved');
}
