import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const getUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    throw new Error('Error fetching users');
  }
};

export const getUserById = async (id) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    logger.info(`User with ID ${id} fetched successfully`);
    return user;
  } catch (error) {
    logger.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    
    // Prepare update data
    const updateData = { ...updates };
    
    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    // Update timestamp
    updateData.updatedAt = new Date();
    
    // Check for email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, updateData.email))
        .limit(1);
      
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    logger.info(`User with ID ${id} updated successfully`);
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    // Check if user exists
    await getUserById(id);
    
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    logger.info(`User with ID ${id} deleted successfully`);
    return deletedUser;
  } catch (error) {
    logger.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
