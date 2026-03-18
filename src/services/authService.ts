import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import getEnv from '../config/environment';
import { sanitizeEmail } from '../utils/helpers';
import { createError } from '../middleware/errorHandler';
import { JwtPayload } from '../middleware/auth';
import type { RegisterInput, LoginInput } from '../utils/validators';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

function generateTokens(user: User): AuthTokens {
  const env = getEnv();
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = sanitizeEmail(input.email);

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw createError('Email already in use', 409);
    }

    const user = this.userRepo.create({
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      password: input.password,
      role: UserRole.USER,
    });

    await this.userRepo.save(user);

    const tokens = generateTokens(user);
    await this.userRepo.update(user.id, { refreshToken: tokens.refreshToken });

    return { user, tokens };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = sanitizeEmail(input.email);
    const user = await this.userRepo.findOne({
      where: { email, isActive: true },
      select: ['id', 'email', 'firstName', 'lastName', 'password', 'role', 'isActive', 'createdAt', 'updatedAt', 'refreshToken'],
    });

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw createError('Invalid email or password', 401);
    }

    const tokens = generateTokens(user);
    await this.userRepo.update(user.id, { refreshToken: tokens.refreshToken });

    return { user, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const env = getEnv();
    let payload: { sub: string };

    try {
      payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
    } catch {
      throw createError('Invalid or expired refresh token', 401);
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub, refreshToken, isActive: true },
    });

    if (!user) {
      throw createError('Invalid refresh token', 401);
    }

    const tokens = generateTokens(user);
    await this.userRepo.update(user.id, { refreshToken: tokens.refreshToken });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: null });
  }
}
