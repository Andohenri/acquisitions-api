import express from 'express';
import { 
  getAllUsers, 
  getUserByIdController, 
  updateUserController, 
  deleteUserController 
} from '#controllers/users.controller.js';
import { authenticateToken, requireRole } from '#middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/users - Get all users (admin only)
router.get('/', requireRole('admin'), getAllUsers);

// GET /api/users/:id - Get user by ID (authenticated users)
router.get('/:id', getUserByIdController);

// PUT /api/users/:id - Update user by ID (authenticated users)
router.put('/:id', updateUserController);

// DELETE /api/users/:id - Delete user by ID (authenticated users)
router.delete('/:id', deleteUserController);

export default router;
