import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import getEnv from '../config/environment';
import { createError } from './errorHandler';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export function configurePassport(): void {
  const env = getEnv();

  // JWT Strategy
  const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: JwtPayload, done) => {
      try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: payload.sub, isActive: true } });
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }),
  );

  // Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
          where: { email: email.toLowerCase(), isActive: true },
          select: ['id', 'email', 'firstName', 'lastName', 'password', 'role', 'isActive'],
        });
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(createError('Unauthorized - invalid or expired token', 401));
    }
    req.user = user;
    next();
  })(req, res, next);
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User | undefined;
    if (!user) {
      return next(createError('Unauthorized', 401));
    }
    if (!roles.includes(user.role)) {
      return next(createError('Forbidden - insufficient permissions', 403));
    }
    next();
  };
}
