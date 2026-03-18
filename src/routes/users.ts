import { Router } from 'express';
import { validate } from '../middleware/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { listUsers, getUser, updateUser, deleteUser, getProfile } from '../controllers/userController';
import { updateUserSchema, paginationSchema } from '../utils/validators';
import { UserRole } from '../models/User';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 */
router.get('/', requireAuth, requireRole(UserRole.ADMIN), validate(paginationSchema), listUsers);

/**
 * @openapi
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', requireAuth, getProfile);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
router.get('/:id', requireAuth, getUser);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', requireAuth, validate(updateUserSchema), updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user (admin only)
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', requireAuth, requireRole(UserRole.ADMIN), deleteUser);

export default router;
