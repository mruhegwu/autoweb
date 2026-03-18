import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { sanitizeEmail } from '../utils/helpers';
import type { UpdateUserInput } from '../utils/validators';

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { users, total };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw createError('User not found', 404);
    }
    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);

    if (input.email) {
      const email = sanitizeEmail(input.email);
      const existing = await this.userRepo.findOne({ where: { email } });
      if (existing && existing.id !== id) {
        throw createError('Email already in use', 409);
      }
      user.email = email;
    }

    if (input.firstName) {
      user.firstName = input.firstName;
    }
    if (input.lastName) {
      user.lastName = input.lastName;
    }

    return this.userRepo.save(user);
  }

  async deactivate(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepo.update(id, { isActive: false });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepo.delete(id);
  }
}
