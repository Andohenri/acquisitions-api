import { getUsers, getUserById, updateUser, deleteUser } from '#services/users.service.js';
import logger from '#config/logger.js';
import { formatValidationErrors } from '#utils/format.js';
import {
  getUserByIdSchema,
  updateUserRequestSchema,
  deleteUserRequestSchema,
} from '#validations/users.validation.js';

export const getAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');
    const users = await getUsers();
    return res
      .status(200)
      .json({ message: 'Users fetched successfully', users, count: users.length });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const validationResult = getUserByIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data.params;
    logger.info(`Fetching user with ID ${id}`);
    
    const user = await getUserById(id);
    return res
      .status(200)
      .json({ message: 'User fetched successfully', user });
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const validationResult = updateUserRequestSchema.safeParse({
      params: req.params,
      body: req.body,
    });
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data.params;
    const updates = validationResult.data.body;
    const currentUser = req.user; // Assumes authentication middleware sets req.user

    logger.info(`User ${currentUser?.id} attempting to update user ${id}`);

    // Authorization checks
    if (!currentUser) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Users can only update their own information, unless they are admin
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own information.' 
      });
    }

    // Only admins can change user roles
    if (updates.role && currentUser.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Only admins can change user roles.' 
      });
    }

    // If non-admin user is updating themselves, remove role from updates
    if (currentUser.id === id && currentUser.role !== 'admin') {
      delete updates.role;
    }

    const updatedUser = await updateUser(id, updates);
    
    logger.info(`User with ID ${id} updated successfully by user ${currentUser.id}`);
    return res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    logger.error('Error updating user:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const validationResult = deleteUserRequestSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data.params;
    const currentUser = req.user; // Assumes authentication middleware sets req.user

    logger.info(`User ${currentUser?.id} attempting to delete user ${id}`);

    // Authorization checks
    if (!currentUser) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Users can delete their own account, admins can delete any account
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own account.' 
      });
    }

    // Prevent users from deleting their own admin account (optional safety check)
    if (currentUser.id === id && currentUser.role === 'admin') {
      const allAdmins = await getUsers();
      const adminCount = allAdmins.filter(user => user.role === 'admin').length;
      
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot delete the last admin account.' 
        });
      }
    }

    const deletedUser = await deleteUser(id);
    
    logger.info(`User with ID ${id} deleted successfully by user ${currentUser.id}`);
    return res
      .status(200)
      .json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    logger.error('Error deleting user:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
