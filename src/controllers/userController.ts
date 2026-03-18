import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { successResponse, paginate } from '../utils/helpers';
import { User } from '../models/User';

const userService = new UserService();

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { users, total } = await userService.findAll(page, limit);
    const { data, meta } = paginate(users.map((u) => u.toJSON()), total, page, limit);
    successResponse(res, data, 'Users retrieved', 200, meta);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.findById(req.params.id);
    successResponse(res, user.toJSON(), 'User retrieved');
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.update(req.params.id, req.body);
    successResponse(res, user.toJSON(), 'User updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.delete(req.params.id);
    successResponse(res, null, 'User deleted');
  } catch (error) {
    next(error);
  }
}

export function getProfile(req: Request, res: Response): void {
  const user = req.user as User;
  successResponse(res, user.toJSON(), 'Profile retrieved');
}
